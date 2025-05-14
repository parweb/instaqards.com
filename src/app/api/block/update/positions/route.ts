import type { Block, Site } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from 'helpers/db';
import { revalidate } from 'helpers/revalidate';
import { getSession } from 'lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
