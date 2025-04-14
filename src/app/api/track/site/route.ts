import { NextResponse } from 'next/server';

import { db } from 'helpers/db';

export async function POST(request: Request) {
  const body = await request.json();

  const subdomain = body.domain.endsWith(
    `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  )
    ? body.domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '')
    : null;

  const site = await db.site.findUniqueOrThrow({
    where: subdomain
      ? { subdomain: subdomain.toLowerCase() }
      : { customDomain: body.subdomain.toLowerCase() }
  });

  const click = await db.click.create({
    data: {
      siteId: site.id,
      request: body
    }
  });

  return NextResponse.json({ click });
}
