import { type NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';

import authConfig from 'auth.config';
import { apiAuthPrefix, authRoutes, publicRoutes } from 'settings';

export const config = {
  matcher: ['/((?!api/|_next/|assets|_static/|_vercel|[\\w-]+\\.\\w+).*)']
};

const { auth } = NextAuth({
  ...authConfig,
  providers: authConfig.providers.filter(provider => provider.id !== 'resend')
});

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  console.log('01', { url });

  const isApiAuthRoute = url.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(url.pathname);
  const isPublicRoute =
    publicRoutes.some(route => url.pathname.includes(route)) ||
    isAuthRoute ||
    isApiAuthRoute;

  console.log('02', { isApiAuthRoute, isAuthRoute, isPublicRoute });

  let hostname = req.headers
    .get('host')
    ?.replace('.localhost:11000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  console.log('03', { hostname });

  if (
    hostname?.includes('---') &&
    hostname?.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split('---')[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }

  console.log('04', { hostname });

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  console.log('05', { path });

  if (url.searchParams.has('r')) {
    const referer = url.searchParams.get('r');

    const destination = url.clone();

    destination.searchParams.delete('r');

    const domain = new URL(process.env.NEXTAUTH_URL as string);

    return new Response(null, {
      status: 301,
      headers: {
        Location: new URL('', destination.toString()).toString(),
        'Set-Cookie': `r=${encodeURIComponent(referer ?? '')}; Path=/; Domain=${domain.host.replace('app.', '.')}; HttpOnly; SameSite=Strict`
      }
    });
  }

  if (url.pathname.startsWith('/click/')) {
    console.log('06', {
      url: new URL(`/api${url.pathname}?${searchParams}`, req.url).toString()
    });
    return NextResponse.rewrite(
      new URL(`/api${url.pathname}?${searchParams}`, req.url)
    );
  }

  if (
    hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
    hostname?.includes('bore.pub:')
  ) {
    console.log('06', { hostname });

    if (url.pathname === '/home') {
      console.log('07', { pathname: url.pathname });

      return NextResponse.rewrite(
        new URL(url.pathname, req.url.replace(url.pathname, '/'))
      );
    }

    const session = await auth();
    console.log('08', { session });

    if (
      (!!session === false || !session || !session?.user) &&
      isPublicRoute === false
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.rewrite(
      new URL(`/app${path === '/' ? '' : path}`, req.url)
    );
  }

  if (
    hostname?.includes(':11000') ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    console.log('09', { hostname, path, pathname: url.pathname });

    if (url.pathname === '/') {
      return NextResponse.rewrite(
        new URL(`/home${path === '/' ? '' : path}`, req.url)
      );
    }

    return NextResponse.rewrite(
      new URL(
        `/${path.replace('/', '')}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/`,
        req.url.replace(path, '')
      )
    );
  }

  console.log('10', { hostname, path });

  if (hostname?.startsWith('www.')) {
    return NextResponse.rewrite(new URL('/home', req.url));
  }

  console.log('11', { hostname, path });

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
