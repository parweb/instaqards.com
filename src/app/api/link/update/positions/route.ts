import type { Link, Site } from '@prisma/client';
import { db } from 'helpers/db';
import { type NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const { result, site } = (await request.json()) as {
    result: Link[];
    site: Site;
  };

  console.log({ result });

  const links = await db.$transaction(
    result.map(({ id }, position) =>
      db.link.update({
        where: { id },
        data: { position }
      })
    )
  );

  revalidateTag(
    `${site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
  );

  site?.customDomain && revalidateTag(`${site?.customDomain}-metadata`);

  return NextResponse.json(links);
}
