import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';

import authConfig, {
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from 'auth.config';

export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)']
};

const { auth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const isApiAuthRoute = url.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(url.pathname);
  const isPublicRoute =
    publicRoutes.includes(url.pathname) || isAuthRoute || isApiAuthRoute;

  let hostname = req.headers
    .get('host')!
    .replace('.localhost:11000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  if (
    hostname.includes('---') &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split('---')[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`;
  }

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`;

  if (url.searchParams.has('r')) {
    const referer = url.searchParams.get('r');

    const destination = url.clone();

    destination.searchParams.delete('r');

    return new Response(null, {
      status: 301,
      headers: {
        Location: new URL('', destination.toString()).toString(),
        'Set-Cookie': `r=${encodeURIComponent(referer!)}; Path=/; HttpOnly; SameSite=Strict`
      }
    });
  }

  if (url.pathname.startsWith('/click/')) {
    return NextResponse.rewrite(new URL(`/api${url.pathname}`, req.url));
  }

  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const session = await auth();

    if (!session && !isPublicRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    } else if (session && isPublicRoute) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.rewrite(
      new URL(`/app${path === '/' ? '' : path}`, req.url)
    );
  }

  console.log({ hostname });

  if (
    hostname.includes(':11000') ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(
      new URL(`/home${path === '/' ? '' : path}`, req.url)
    );
  }

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
