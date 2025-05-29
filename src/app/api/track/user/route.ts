import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from 'helpers/db';

const input = z.object({
  path: z.string(),
  email: z.string().nullable(),
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.string())
});

export async function POST(request: Request) {
  const body = input.parse(await request.json());

  const user = body.email
    ? await db.user
        .findUnique({
          select: { id: true },
          where: { email: body.email ?? undefined }
        })
        .catch(() => undefined)
    : undefined;

  const click = await db.click.create({
    data: {
      userId: user?.id ?? null,
      request: body,
      path: body.path
    }
  });

  return NextResponse.json({ click });
}
