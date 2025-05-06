import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from 'helpers/db';

const input = z.object({
  path: z.string(),
  referer: z.string().nullable(),
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.string())
});

export async function POST(request: Request) {
  const body = input.parse(await request.json());

  console.log('track/referer', body);

  const click = await db.click.create({
    data: {
      path: body.path,
      refererId: body.referer,
      request: body
    }
  });

  return NextResponse.json({ click });
}
