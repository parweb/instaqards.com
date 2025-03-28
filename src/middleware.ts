import NextAuth from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';

import authConfig from 'auth.config';
import { apiAuthPrefix, authRoutes, marketingRoutes, publicRoutes } from 'settings';

export const config = {
  matcher: ['/((?!api/|_next/|assets|_static/|_vercel|[\\w-]+\\.\\w+).*)']
};

const { auth } = NextAuth({
  ...authConfig,
  providers: authConfig.providers.filter(provider => provider.id !== 'resend')
});

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const isApiAuthRoute = url.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(url.pathname);
  const isPublicRoute =
    publicRoutes.some(route => url.pathname.includes(route)) ||
    isAuthRoute ||
    isApiAuthRoute;

  let hostname = req.headers
    .get('host')
    ?.replace('.localhost:11000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  if (
    hostname?.includes('---') &&
    hostname?.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split('---')[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;
  const isProduction = () =>
    hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
    hostname?.includes('bore.pub:');

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

  if (hostname === 'short.qards.link') {
    return NextResponse.rewrite(
      new URL(`/api/short${url.pathname}?${searchParams}`, req.url)
    );
  }

  if (url.pathname.startsWith('/click/')) {
    return NextResponse.rewrite(
      new URL(`/api${url.pathname}?${searchParams}`, req.url)
    );
  }

  console.log({
    hostname,
    url,
    path,
    isPublicRoute,
    yolo: `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    isProduction: isProduction()
  });

  if (isProduction()) {
    if (marketingRoutes.includes(url.pathname) && hostname?.startsWith('app.') === false) {
      console.log('this is the marketing route', url.pathname)

      return NextResponse.rewrite(
        new URL(url.pathname, req.url.replace(url.pathname, '/'))
      );
    }

    const session = await auth();

    if (
      (!!session === false || !session || !session?.user) &&
      isPublicRoute === false
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    console.log({ session, isPublicRoute });
    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.rewrite(
      new URL(`/app${path === '/' ? '' : path}`, req.url)
    );
  }

  console.log({
    bool: hostname?.includes(':11000') ||
      hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  })

  if (
    hostname?.includes(':11000') ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    console.log({ pathname: url.pathname, marketingRoutes })
    if (marketingRoutes.includes(url.pathname)) {
      console.log('this is the marketing route', `${path === '/' ? '/home' : path}`)
      return NextResponse.rewrite(
        new URL(`${path === '/' ? '/home' : path}`, req.url)
      );
    }

    console.log({ yo: `/${path.replace('/', '')}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/` })

    return NextResponse.rewrite(
      new URL(
        `/${path.replace('/', '')}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/`,
        req.url.replace(path, '')
      )
    );
  }

  if (hostname?.startsWith('www.')) {
    return NextResponse.rewrite(new URL('/home', req.url));
  }

  console.log('this is the end')

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
