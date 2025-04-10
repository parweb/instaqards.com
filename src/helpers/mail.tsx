import 'server-only';

import { render } from '@react-email/render';
import { waitUntil } from '@vercel/functions';
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import { Resend } from 'resend';
import { ulid } from 'ulid';

import { db } from 'helpers/db';
import { sender } from 'settings';
import { DEFAULT_LANG, type Lang } from 'translations';
import ConfirmAccountEmail from '../../emails/confirm-account';
import MagicLinkEmail from '../../emails/magic-link';
import WelcomeEmail from '../../emails/onboarding/01-welcome';
import OutboxEmail from '../../emails/outbox';
import ResetPasswordEmail from '../../emails/reset-password';
import TwoFactorTokenEmail from '../../emails/two-factor-token';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = `http://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

const getLang = async () => {
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

const send = async (
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

  await resend.emails.send({ from, to, subject, react });

  waitUntil(
    render(react, { pretty: true }).then(
      async html =>
        await db.outbox
          .create({
            data: {
              id,
              email: to,
              subject,
              body: html,
              status: 'sent',
              metadata: {
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
          })
          .then(({ metadata }) => console.info(id, metadata))
          .catch(console.error)
    )
  );
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await send(email, TwoFactorTokenEmail, { token });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await send(email, ResetPasswordEmail, { resetLink });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await send(email, ConfirmAccountEmail, { confirmLink });
};

export const sendMagicLinkEmail = async (email: string, magicLink: string) => {
  await send(email, MagicLinkEmail, { magicLink });
};

export const sendWelcomeEmail = async (email: string) => {
  console.info('email::sendWelcomeEmail', { email });

  await send(email, WelcomeEmail);
};

export const sendOutboxEmail = async (
  email: string,
  subject: string,
  body: string
) => {
  console.info('email::sendOutboxEmail', { email, subject, body });

  await send(email, OutboxEmail, { subject, body });
};
