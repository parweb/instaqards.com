import { type NextRequest, NextResponse } from 'next/server';
import { db } from 'helpers/db';
import { z } from 'zod';

const QuerySchema = z.object({
  id: z.string().min(1)
});

const PIXEL_BUFFER = Buffer.from(
  'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const query = Object.fromEntries(new URL(request.url).searchParams);

    const validation = QuerySchema.safeParse(query);

    if (!validation.success) {
      console.warn('Invalid open tracking params:', query);
      return sendPixel();
    }

    const { id } = validation.data;

    console.log({ headers: Object.fromEntries(request.headers.entries()) });

    db.$transaction([
      db.outbox.update({ where: { id }, data: { status: 'OPEN' } }),
      db.$queryRaw`
      UPDATE "Outbox"      
      SET "metadata" = jsonb_set(
        jsonb_set(
            jsonb_set(
                COALESCE("metadata", '{}'::jsonb),
                '{ip}',
                to_jsonb(${request.headers.get('x-forwarded-for')}::text),
                true
            ),
            '{agent}',
            to_jsonb(${request.headers.get('user-agent')}::text),
            true
        ),
        '{openAt}',
        to_jsonb(NOW() at time zone 'utc'),
        true
      )
      WHERE id = ${id}`
    ]);

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
