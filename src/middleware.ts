import { waitUntil } from '@vercel/functions';
import NextAuth from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';
import authConfig from './auth.config';
import {
  apiAuthPrefix,
  authRoutes,
  marketingRoutes,
  publicRoutes
} from './settings';

export const config = {
  matcher: ['/((?!api/|_next/|assets|_static/|_vercel|[\\w-]+\\.\\w+).*)']
};

const { auth } = NextAuth({
  ...authConfig,
  providers: authConfig.providers.filter(provider => provider.id !== 'resend')
});

function normalizeHostname(req: NextRequest): string | undefined {
  let hostname = req.headers
    .get('host')
    ?.replace('.localhost:11000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  if (
    hostname?.includes('---') &&
    hostname?.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split('---')[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }
  return hostname;
}

function isProduction(hostname?: string): boolean {
  return (
    hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
    !!hostname?.includes('bore.pub:')
  );
}

function encodeRequest(req: NextRequest): string {
  return Buffer.from(
    JSON.stringify({
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(
        Array.from(req.headers.entries()) as Iterable<[string, string]>
      )
    })
  ).toString('base64');
}

function trackSite(domain: string, req: NextRequest) {
  waitUntil(
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/track/site`, {
      method: 'POST',
      body: JSON.stringify({
        domain,
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(
          Array.from(req.headers.entries()) as Iterable<[string, string]>
        )
      })
    })
  );
}

function buildPath(url: URL): string {
  const searchParams = url.searchParams.toString();
  return `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;
}

type MiddlewareContext = {
  session: Awaited<ReturnType<typeof auth>>;
  hostname: string | undefined;
  path: string;
  url: URL;
};

type HandlerResult =
  | { action: 'next' }
  | { action: 'break'; response: NextResponse | Response };

interface MiddlewareHandler {
  handle(req: NextRequest, ctx: MiddlewareContext): Promise<HandlerResult>;
}

class LoggerHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    console.log('[MIDDLEWARE][REQUEST]', {
      method: req.method,
      url: req.url,
      hostname: ctx.hostname,
      path: ctx.path
      // headers: Object.fromEntries(Array.from(req.headers.entries()) as Iterable<[string, string]>)
    });
    return { action: 'next' };
  }
}

class RefererTrackingHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    if (ctx.url.searchParams.has('r')) {
      const referer = ctx.url.searchParams.get('r');
      const destination = new URL(ctx.url.toString());
      destination.searchParams.delete('r');
      const domain = new URL(process.env.NEXTAUTH_URL as string);
      return {
        action: 'break',
        response: new Response(null, {
          status: 301,
          headers: {
            Location: destination.toString(),
            'Set-Cookie': `r=${encodeURIComponent(referer ?? '')}; Path=/; Domain=${domain.host.replace('app.', '.')}; HttpOnly; SameSite=Strict`
          }
        })
      };
    }
    return { action: 'next' };
  }
}

class ShortLinkRedirectHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    if (ctx.hostname === 'short.qards.link') {
      const search = ctx.url.searchParams;
      search.append('request', encodeRequest(req));
      return {
        action: 'break',
        response: NextResponse.redirect(
          new URL(`/api/short${ctx.url.pathname}?${search.toString()}`, req.url)
        )
      };
    }
    return { action: 'next' };
  }
}

class ClickTrackingHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    if (ctx.url.pathname.startsWith('/click/')) {
      const search = ctx.url.searchParams;
      search.append('request', encodeRequest(req));
      return {
        action: 'break',
        response: NextResponse.redirect(
          new URL(`/api${ctx.url.pathname}?${search.toString()}`, req.url)
        )
      };
    }
    return { action: 'next' };
  }
}

class ProductionHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    if (!isProduction(ctx.hostname)) return { action: 'next' };
    const isApiAuthRoute = ctx.url.pathname.startsWith(apiAuthPrefix);
    const isAuthRoute = authRoutes.includes(ctx.url.pathname);
    const isPublicRoute =
      publicRoutes.some(route => ctx.url.pathname.includes(route)) ||
      isAuthRoute ||
      isApiAuthRoute;
    if (
      marketingRoutes.includes(ctx.url.pathname) &&
      ctx.hostname?.startsWith('app.') === false
    ) {
      return {
        action: 'break',
        response: NextResponse.rewrite(
          new URL(ctx.url.pathname, req.url.replace(ctx.url.pathname, '/'))
        )
      };
    }
    if (
      (!ctx.session || !('user' in ctx.session) || !ctx.session.user) &&
      !isPublicRoute
    ) {
      return {
        action: 'break',
        response: NextResponse.redirect(new URL('/login', req.url))
      };
    }
    if (
      ctx.session &&
      'user' in ctx.session &&
      ctx.session.user &&
      isPublicRoute
    ) {
      return {
        action: 'break',
        response: NextResponse.redirect(new URL('/', req.url))
      };
    }
    return {
      action: 'break',
      response: NextResponse.rewrite(
        new URL(`/app${ctx.path === '/' ? '' : ctx.path}`, req.url)
      )
    };
  }
}

class DevHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    if (
      ctx.hostname?.includes(':11000') ||
      ctx.hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
    ) {
      if (marketingRoutes.includes(ctx.url.pathname)) {
        return {
          action: 'break',
          response: NextResponse.rewrite(
            new URL(`${ctx.path === '/' ? '/home' : ctx.path}`, req.url)
          )
        };
      }
      const subdomain = ctx.path.replace('/', '');
      const domain = `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
      trackSite(domain, req);
      return {
        action: 'break',
        response: NextResponse.rewrite(
          new URL(`/${domain}/`, req.url.replace(ctx.path, ''))
        )
      };
    }
    return { action: 'next' };
  }
}

class WwwHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    if (ctx.hostname?.startsWith('www.')) {
      return {
        action: 'break',
        response: NextResponse.rewrite(new URL('/home', req.url))
      };
    }
    return { action: 'next' };
  }
}

class DefaultRewriteHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    const domain = `${ctx.hostname}${ctx.path}`.trim().replace(/\/$/, '');
    trackSite(domain, req);
    return {
      action: 'break',
      response: NextResponse.rewrite(
        new URL(`/${ctx.hostname}${ctx.path}`, req.url)
      )
    };
  }
}

const handlers: MiddlewareHandler[] = [
  new LoggerHandler(),
  new RefererTrackingHandler(),
  new ShortLinkRedirectHandler(),
  new ClickTrackingHandler(),
  new ProductionHandler(),
  new DevHandler(),
  new WwwHandler(),
  new DefaultRewriteHandler()
];

export default async function middleware(
  req: NextRequest
): Promise<NextResponse | Response> {
  const session = await auth();
  const url = req.nextUrl;
  const hostname = normalizeHostname(req);
  const path = buildPath(url);
  // @ts-ignore
  const ctx: MiddlewareContext = { session, hostname, path, url };
  let response: NextResponse | Response | null = null;

  try {
    for (const handler of handlers) {
      const result = await handler.handle(req, ctx);
      if (result.action === 'break') {
        response = result.response;
        break;
      }
    }

    if (!response) response = NextResponse.next();

    console.log('[MIDDLEWARE][RESPONSE]', {
      url: req.url,
      status: response instanceof Response ? response.status : 'unknown',
      redirected:
        response instanceof Response
          ? response.headers.get('Location')
          : undefined
    });

    return response;
  } catch (err) {
    console.error('[MIDDLEWARE][UNCAUGHT ERROR]', {
      error: err,
      url: req.url,
      hostname
    });
    throw err;
  }
}
