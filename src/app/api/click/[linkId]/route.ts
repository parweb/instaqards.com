import { NextResponse } from 'next/server';

import { db } from 'helpers/db';

export async function GET(
  _: Request,
  { params: { linkId } }: { params: { linkId: string } }
) {
  const click = await db.click.create({
    include: { link: true },
    data: { linkId }
  });

  return NextResponse.redirect(click.link?.href ?? '');
}
