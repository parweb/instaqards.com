import { Outbox } from '@prisma/client';
import { db } from 'helpers/db';
import { Webhook } from 'svix';

const webhook = new Webhook(String(process.env.RESEND_WEBHOOK_SECRET));

type EmailType =
  | 'email.sent'
  | 'email.delivered'
  | 'email.delivery_delayed'
  | 'email.complained'
  | 'email.bounced'
  | 'email.opened'
  | 'email.clicked';

interface WebhookEvent {
  created_at: string;
  data: {
    created_at: string;
    email_id: string;
    from: string;
    subject: string;
    to: string[];
  };
  type: EmailType;
}

export async function POST(req: Request) {
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers.entries());

  const body = webhook.verify(payload, headers) as WebhookEvent;

  console.info({ body });

  console.info(body.data.to);

  if (body.type === 'email.bounced') {
    db.$queryRaw<Outbox[]>`
      UPDATE "Outbox"
      SET "metadata" = jsonb_set(
        COALESCE("metadata", '{}'::jsonb),
        ARRAY['events'],
        COALESCE("metadata"->'events', '[]'::jsonb) ||
        jsonb_build_object(
          'type', 'bounced',
          'createdAt', to_jsonb(NOW() at time zone 'utc')
        ),
        true
      )
      WHERE email IN (${body.data.to.join(',')}) 
      RETURNING "metadata";`
      .then(([{ metadata }]) => console.info(body.data.to, metadata))
      .catch(error => {
        console.error(error);
        console.error(error.meta);
      });
  }

  if (body.type === 'email.complained') {
    db.$queryRaw<Outbox[]>`
      UPDATE "Outbox"
      SET "metadata" = jsonb_set(
        COALESCE("metadata", '{}'::jsonb),
        ARRAY['events'],
        COALESCE("metadata"->'events', '[]'::jsonb) ||
        jsonb_build_object(
          'type', 'spam',
          'createdAt', to_jsonb(NOW() at time zone 'utc')
        ),
        true
      )
      WHERE email IN (${body.data.to.join(',')}) 
      RETURNING "metadata";`
      .then(([{ metadata }]) => console.info(body.data.to, metadata))
      .catch(error => {
        console.error(error);
        console.error(error.meta);
      });
  }

  return new Response('ok', { status: 200 });
}
