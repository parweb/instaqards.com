import { NextResponse } from 'next/server';

import { db } from 'helpers/db';

export async function GET(
  _: Request,
  props: { params: Promise<{ linkId: string }> }
) {
  const params = await props.params;

  const { linkId } = params;

  try {
    const click = await db.click.create({
      include: { link: true },
      data: { linkId }
    });

    if (!click.link) {
      console.error('api::click::[linkId] Link not found', { linkId });
      return NextResponse.redirect('/');
    }

    const redirectUrl = click.link.url;

    console.info({ redirectUrl });

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('api::click::[linkId] Error processing click', {
      linkId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.redirect('/');
  }
}
