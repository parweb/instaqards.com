import type { Block, Site } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from 'helpers/db';
import { revalidate } from 'helpers/revalidate';

export async function POST(request: NextRequest) {
  const { result, site } = (await request.json()) as {
    result: Block[];
    site: Site;
  };

  const blocks = await db.$transaction(
    result.map(({ id }, position) =>
      db.block.update({
        where: { id },
        data: { position }
      })
    )
  );

  revalidate(site);

  return NextResponse.json(blocks);
}
