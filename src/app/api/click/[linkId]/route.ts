import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(
  _: Request,
  { params: { linkId } }: { params: { linkId: string } }
) {
  const click = await prisma.click.create({
    include: { link: true },
    data: { linkId }
  });

  return NextResponse.redirect(click.link!.href);
}
