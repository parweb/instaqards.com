import 'server-only';

import { Campaign, Prisma } from '@prisma/client';
import { render } from '@react-email/render';
import { waitUntil } from '@vercel/functions';
import { nanoid } from 'nanoid';
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import { Resend } from 'resend';
import { ulid } from 'ulid';

import { db } from 'helpers/db';
import { trySafe } from 'helpers/trySafe';
import { sender } from 'settings';
import { DEFAULT_LANG, type Lang } from 'translations';
import ConfirmAccountEmail from '../../emails/confirm-account';
import MagicLinkEmail from '../../emails/magic-link';
import WelcomeEmail from '../../emails/onboarding/01-welcome';
import OutboxEmail from '../../emails/outbox';
import ResetPasswordEmail from '../../emails/reset-password';
import TwoFactorTokenEmail from '../../emails/two-factor-token';

const resend = new Resend(process.env.RESEND_API_KEY);

export const getLang = async () => {
  let lang = (((await cookies()) as unknown as UnsafeUnwrappedCookies).get(
    'lang'
  )?.value ?? DEFAULT_LANG) as Lang;

  switch (true) {
    case lang.toLowerCase().includes('fr'):
      lang = 'fr';
      break;
    case lang.toLowerCase().includes('en'):
      lang = 'en';
      break;
    case lang.toLowerCase().includes('us'):
    case lang.toLowerCase().includes('gb'):
      lang = 'en';
      break;
    case lang.toLowerCase().includes('it'):
      lang = 'it';
      break;
    case lang.toLowerCase().includes('es'):
      lang = 'es';
      break;
    default:
      lang = 'en';
      break;
  }

  return lang;
};

export const sendHtmlWithCampaign = async (
  id: string,
  to: string,
  subject: string,
  html: string,
  campaignId: Campaign['id'],
  from: string = sender
) => {
  const sent = await resend.emails.send({
    from,
    to:
      process.env.NODE_ENV === 'development'
        ? `parweb+${btoa(to).replaceAll('=', '')}@gmail.com`
        : to,
    subject,
    html
  });
  if (sent.error) {
    console.error(`Failed to send email:`, sent);
    throw new Error(`Failed to send email: ${sent.error.message}`);
  }

  waitUntil(
    new Promise(async resolve => {
      const [, session] = await trySafe(async () => {
        const { getSession } = await import('lib/auth');

        const session = await getSession();
        return session;
      }, null);

      const correlationId = nanoid();

      const destination = await db.user.findUnique({
        select: { id: true },
        where: { email: to }
      });

      resolve(
        await db
          .$transaction([
            db.outbox.create({
              data: {
                id,
                email: to,
                subject,
                body: html,
                status: 'sent',
                campaignId,
                metadata: {
                  resend_id: sent.data?.id,
                  events: [
                    {
                      type: 'sent',
                      createdAt: new Date().toISOString()
                    }
                  ]
                }
              }
            }),
            db.event.createMany({
              data: [
                session !== null
                  ? {
                      userId: String(session.user.id),
                      eventType: 'LEAD_CONTACTED',
                      payload: {
                        by: 'EMAIL',
                        id,
                        from,
                        to,
                        subject,
                        campaignId
                      },
                      correlationId
                    }
                  : undefined,
                {
                  userId: destination?.id ?? null,
                  eventType: 'EMAIL_SENT',
                  payload: {
                    id,
                    from,
                    to,
                    subject,
                    campaignId
                  },
                  correlationId
                }
              ].filter(Boolean) as Prisma.EventCreateManyInput[]
            })
          ])
          .then(([{ metadata }]) => console.info(id, metadata))
          .catch(console.error)
      );
    })
  );
};

const sendTemplateReact = async (
  to: string,
  Template: React.FunctionComponent<
    { lang: Lang; id: string; subject: string } & Record<string, string>
  > & { subject: Record<Lang, string> },
  variables: Record<string, string> = {},
  from: string = sender
) => {
  const id = ulid();

  const lang = await getLang();

  const subject =
    'subject' in variables ? variables.subject : Template.subject[lang];

  const react = (
    <Template lang={lang} subject={subject} id={id} {...variables} />
  );

  const sent = await resend.emails.send({
    from,
    to:
      process.env.NODE_ENV === 'development'
        ? `parweb+${btoa(to).replaceAll('=', '')}@gmail.com`
        : to,
    subject,
    react
  });

  if (sent.error) {
    console.error(`Failed to send email:`, sent);
    throw new Error(`Failed to send email: ${sent.error.message}`);
  }

  waitUntil(
    render(react, { pretty: true }).then(async html => {
      const [, session] = await trySafe(async () => {
        const { getSession } = await import('lib/auth');

        const session = await getSession();
        return session;
      }, null);

      const correlationId = nanoid();

      const destination = await db.user.findUnique({
        select: { id: true },
        where: { email: to }
      });

      if (!destination) {
        return null;
      }

      await db
        .$transaction(
          [
            db.outbox.create({
              data: {
                id,
                email: to,
                subject,
                body: html,
                status: 'sent',
                metadata: {
                  resend_id: sent.data?.id,
                  lang,
                  variables,
                  events: [
                    {
                      type: 'sent',
                      createdAt: new Date().toISOString()
                    }
                  ]
                }
              }
            }),
            destination
              ? db.event.createMany({
                  data: [
                    session !== null
                      ? {
                          userId: String(session.user.id),
                          eventType: 'LEAD_CONTACTED',
                          payload: {
                            by: 'EMAIL',
                            id,
                            from,
                            to,
                            subject
                          },
                          correlationId
                        }
                      : undefined,
                    {
                      userId: destination.id,
                      eventType: 'EMAIL_SENT',
                      payload: {
                        id,
                        from,
                        to,
                        subject
                      },
                      correlationId
                    }
                  ].filter(Boolean) as Prisma.EventCreateManyInput[]
                })
              : null
          ].filter(Boolean) as Prisma.PrismaPromise<any>[]
        )
        .then(([{ metadata }]) => console.info(id, metadata))
        .catch(console.error);
    })
  );
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await sendTemplateReact(email, TwoFactorTokenEmail, { token });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {
  await sendTemplateReact(email, ResetPasswordEmail, { resetLink });
};

export const sendVerificationEmail = async (
  email: string,
  confirmLink: string
) => {
  await sendTemplateReact(email, ConfirmAccountEmail, { confirmLink });
};

export const sendMagicLinkEmail = async (email: string, magicLink: string) => {
  await sendTemplateReact(email, MagicLinkEmail, { magicLink });
};

export const sendWelcomeEmail = async (email: string) => {
  console.info('email::sendWelcomeEmail', { email });

  await sendTemplateReact(email, WelcomeEmail);
};

export const sendOutboxEmail = async (
  email: string,
  subject: string,
  body: string
) => {
  console.info('email::sendOutboxEmail', { email, subject, body });

  await sendTemplateReact(email, OutboxEmail, { subject, body });
};
