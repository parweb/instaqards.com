import { Outbox } from '@prisma/client';
import { after, type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from 'helpers/db';

const QuerySchema = z.object({
  id: z.string().min(1)
});

const PIXEL_BUFFER = Buffer.from(
  'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

export async function GET(request: NextRequest) {
  try {
    if (
      // request.headers.get('referer')?.includes('localhost') ||
      request.headers.get('referer')?.includes('qards.link')
    ) {
      throw new Error("Don't track internal user");
    }

    const query = Object.fromEntries(new URL(request.url).searchParams);

    const validation = QuerySchema.safeParse(query);

    if (!validation.success) {
      console.warn('Invalid open tracking params:', query);
      return sendPixel();
    }

    const { id } = validation.data;

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    const agent = request.headers.get('user-agent') ?? 'unknown';

    after(
      db.$queryRaw<Outbox[]>`
        UPDATE "Outbox"      
        SET status = 'opened', "metadata" = jsonb_set(
          COALESCE("metadata", '{}'::jsonb),
          ARRAY['events'],
          COALESCE("metadata"->'events', '[]'::jsonb) ||
            jsonb_build_object(
              'type', 'open',
              'ip', ${ip}::text,
              'agent', ${agent}::text,
              'createdAt', to_jsonb(NOW() at time zone 'utc')
            ),
          true
        )
        WHERE id = ${id}
        RETURNING "metadata";
      `
        .then(res => console.info(id, res))
        .catch(console.error)
    );

    return sendPixel();
  } catch (error) {
    console.error('Error in /api/email/track/open:', error);

    return sendPixel();
  }
}

function sendPixel() {
  return new NextResponse(PIXEL_BUFFER, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private'
    },
    status: 200
  });
}
