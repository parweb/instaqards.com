import { NextResponse } from 'next/server';

import { auth } from 'lib/auth';
import { uri } from 'settings';

export async function GET(req: Request) {
  await auth.api.signInAnonymous();
  return NextResponse.redirect(uri.base('/pro'));
}
