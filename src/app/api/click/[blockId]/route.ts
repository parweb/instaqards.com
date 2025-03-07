import { NextResponse } from 'next/server';

import { db } from 'helpers';

export async function GET(
  _: Request,
  { params: { blockId } }: { params: { blockId: string } }
) {
  const click = await db.click.create({
    include: { block: true },
    data: { blockId }
  });

  return NextResponse.redirect(click.block?.href ?? '');
}
