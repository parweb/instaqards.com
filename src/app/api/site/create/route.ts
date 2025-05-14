import { type NextRequest, NextResponse } from 'next/server';

import { db } from 'helpers/db';
import { createSite } from 'lib/actions';
import { getSession } from 'lib/auth';
import { uri } from 'settings';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain');

  const session = await getSession();

  if (!subdomain) {
    return NextResponse.redirect(uri.app());
  }

  const already = await db.site.findFirst({
    where: { subdomain }
  });

  if (already) {
    return NextResponse.redirect(uri.app(`/site/${already.id}`));
  }

  if (session && session.user) {
    const last = await db.site.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    if (last) {
      await db.site.update({
        where: { id: last.id },
        data: { subdomain, name: subdomain }
      });

      return NextResponse.redirect(uri.app(`/site/${last.id}`));
    }
  }

  const form = new FormData();

  form.append('name', subdomain);
  form.append('subdomain', subdomain);
  form.append('description', '');

  const site = await createSite(form);

  if ('error' in site) {
    return NextResponse.redirect(uri.app());
  }

  return NextResponse.redirect(uri.app(`/site/${site.id}`));
}
