import { Outbox } from '@prisma/client';
import { after, type NextRequest, NextResponse } from 'next/server';

import { db } from 'helpers/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get('id');
  const name = searchParams.get('name') ?? null;
  const url = searchParams.get('url');

  if (!id || !url) {
    return NextResponse.json(
      { error: 'Missing id or urlparameter' },
      { status: 400 }
    );
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const agent = request.headers.get('user-agent') ?? 'unknown';

  after(
    db.$queryRaw<Outbox[]>`
      UPDATE "Outbox"
    SET
      "metadata" = jsonb_set(
        COALESCE("metadata", '{}'::jsonb),
        ARRAY['events'],
        COALESCE("metadata"->'events', '[]'::jsonb) ||
          jsonb_build_object(
            'type', 'click',
            'name', ${name}::text,
            'url', ${url}::text,
            'ip', ${ip}::text,
            'agent', ${agent}::text,
            'createdAt', to_jsonb(NOW() at time zone 'utc')
          ),
        true
      )
    WHERE id = ${id} 
    RETURNING "metadata";
    `
      .then(([{ metadata }]) => console.log(id, metadata))
      .catch(error => {
        console.error(error);
        console.error(error.meta);
      })
  );

  return NextResponse.redirect(url);
}
