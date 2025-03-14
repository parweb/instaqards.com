import { db } from 'helpers/db';
import { createSite } from 'lib/actions';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain');

  if (!subdomain) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}`);
  }

  const form = new FormData();

  form.append('name', subdomain);
  form.append('subdomain', subdomain);
  form.append('description', '');

  const already = await db.site.findFirst({
    where: { subdomain }
  });

  if (already) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/site/${already.id}`
    );
  }

  const site = await createSite(form);

  if ('error' in site) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}`);
  }

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/site/${site.id}`);
}
