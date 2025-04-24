import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from 'helpers/db';

const input = z.object({
  domain: z.string().transform(val => val.toLowerCase()),
  subdomain: z
    .string()
    .optional()
    .transform(val => (val ? val.toLowerCase() : null))
});

export async function POST(request: Request) {
  const body = input.parse(await request.json());

  const subdomain = body.domain
    .split('/?')
    .at(0)
    ?.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? body.domain
        .split('/?')
        .at(0)
        ?.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '')
    : null;

  console.log('track/site', {
    where: subdomain
      ? { subdomain: subdomain.toLowerCase() }
      : { customDomain: body.subdomain?.toLowerCase() }
  });

  const site = await db.site.findUnique({
    where: subdomain
      ? { subdomain: subdomain.toLowerCase() }
      : { customDomain: body.subdomain?.toLowerCase() }
  });

  if (!site)
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });

  const click = await db.click.create({
    data: {
      siteId: site.id,
      request: body
    }
  });

  return NextResponse.json({ click });
}
