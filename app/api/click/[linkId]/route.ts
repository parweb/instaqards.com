import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params: { linkId } }: { params: { linkId: string } }
) {
  console.log({ linkId });

  const click = await prisma.click.create({
    include: { link: true },
    data: {
      linkId
    }
  });

  console.log({ click });

  return NextResponse.redirect(click.link.href);
}
