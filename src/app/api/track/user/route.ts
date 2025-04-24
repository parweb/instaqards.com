import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from 'helpers/db';
import { getSession } from 'lib/auth';

const input = z.object({
  path: z.string(),
  email: z.string().nullable(),
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.string())
});

export async function POST(request: Request) {
  const body = input.parse(await request.json());

  const user = await db.user.findUnique({
    where: { email: body.email ?? undefined }
  });

  const click = await db.click.create({
    data: {
      userId: user?.id ?? null,
      request: body,
      path: body.path
    }
  });

  return NextResponse.json({ click });
}
