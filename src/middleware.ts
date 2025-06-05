import { betterFetch } from '@better-fetch/fetch';
import { waitUntil } from '@vercel/functions';
import { type NextRequest, NextResponse } from 'next/server';

import { auth } from 'lib/auth';

import {
  apiAuthPrefix,
  authRoutes,
  marketingRoutes,
  publicRoutes,
  uri
} from 'settings';

export const config = {
  matcher: ['/((?!api/|_next/|assets|_static/|_vercel|[\\w-]+\\.\\w+).*)']
};

type Session = typeof auth.$Infer.Session;

function normalizeHostname(req: NextRequest): string | undefined {
  let hostname = req.headers
    .get('host')
    ?.replace('.qards.local:11000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ?.replace('.qards.local', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ?.replace('.localhost:11000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  if (
    hostname?.includes('---') &&
    hostname?.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split('---')[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }
  return hostname;
}

function isDashboard(hostname?: string): boolean {
  return hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
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

function trackUser(path: string, email: string | null, req: NextRequest) {
  waitUntil(
    fetch(uri.base('/api/track/user'), {
      method: 'POST',
      body: JSON.stringify({
        path,
        email,
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(
          Array.from(req.headers.entries()) as Iterable<[string, string]>
        )
      })
    })
  );
}

function trackSite(domain: string, req: NextRequest, _name: string) {
  waitUntil(
    fetch(uri.base('/api/track/site'), {
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

function trackReferer(path: string, referer: string, req: NextRequest) {
  waitUntil(
    fetch(uri.base('/api/track/referer'), {
      method: 'POST',
      body: JSON.stringify({
        path,
        referer,
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
  session: Session | null;
  hostname: string | undefined;
  path: string;
  url: URL;
};

type HandlerResult = { name: string } & (
  | { action: 'next' }
  | { action: 'break'; response: NextResponse | Response }
);

interface MiddlewareHandler {
  handle(req: NextRequest, ctx: MiddlewareContext): Promise<HandlerResult>;
}

class LoggerHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    console.info('[MIDDLEWARE][REQUEST]', {
      method: req.method,
      url: req.url,
      hostname: ctx.hostname,
      path: ctx.path
      // headers: Object.fromEntries(Array.from(req.headers.entries()) as Iterable<[string, string]>)
    });

    return { action: 'next', name: 'LoggerHandler' };
  }
}

class RefererTrackingHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    if (ctx.url.searchParams.has('r')) {
      const referer = String(ctx.url.searchParams.get('r'));

      const destination = new URL(ctx.url.toString());
      destination.searchParams.delete('r');

      const url = req.nextUrl;
      const path = buildPath(url);

      trackReferer(`${req.headers.get('host')}${path}`, referer, req);

      return {
        action: 'break',
        name: 'RefererTrackingHandler',
        response: new Response(null, {
          status: 301,
          headers: {
            Location: destination.toString(),
            'Set-Cookie': `r=${encodeURIComponent(referer ?? '')}; Path=/; Domain=${new URL(process.env.NEXTAUTH_URL as string).host.replace('app.', '.')}; HttpOnly; SameSite=Strict`
          }
        })
      };
    }

    return { action: 'next', name: 'RefererTrackingHandler' };
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
        name: 'ShortLinkRedirectHandler',
        response: NextResponse.redirect(
          new URL(`/api/short${ctx.url.pathname}?${search.toString()}`, req.url)
        )
      };
    }

    return { action: 'next', name: 'ShortLinkRedirectHandler' };
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
        name: 'ClickTrackingHandler',
        action: 'break',
        response: NextResponse.redirect(
          new URL(`/api${ctx.url.pathname}?${search.toString()}`, req.url)
        )
      };
    }

    return { action: 'next', name: 'ClickTrackingHandler' };
  }
}

class ProtectedHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    if (!isDashboard(ctx.hostname))
      return { action: 'next', name: 'ProtectedHandler' };

    const isApiAuthRoute = ctx.url.pathname.startsWith(apiAuthPrefix);
    const isAuthRoute = authRoutes.includes(ctx.url.pathname);
    const isPublicRoute =
      publicRoutes.some(route => ctx.url.pathname.includes(route)) ||
      isAuthRoute ||
      isApiAuthRoute;

    if (
      marketingRoutes.some(route => ctx.url.pathname.includes(route)) &&
      ctx.hostname?.startsWith('app.') === false
    ) {
      return {
        action: 'break',
        name: 'ProtectedHandler',
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
        name: 'ProtectedHandler',
        response: NextResponse.redirect(new URL('/login', req.url))
      };
    }

    if (
      ctx.session &&
      'user' in ctx.session &&
      ctx.session.user &&
      isPublicRoute &&
      ctx.path !== '/email-in'
    ) {
      return {
        action: 'break',
        name: 'ProtectedHandler',
        response: NextResponse.redirect(new URL('/', req.url))
      };
    }

    return {
      action: 'break',
      name: 'ProtectedHandler',
      response: NextResponse.rewrite(
        new URL(`/app${ctx.path === '/' ? '' : ctx.path}`, req.url)
      )
    };
  }
}

class PublicHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    if (
      ctx.hostname?.includes(':11000') ||
      ctx.hostname?.includes('.local') ||
      ctx.hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
    ) {
      if (marketingRoutes.some(route => ctx.url.pathname.includes(route))) {
        return {
          action: 'break',
          name: 'PublicHandler',
          response: NextResponse.rewrite(
            new URL(
              `${ctx.path.split('?').at(0) === '/' ? '/home' : ctx.path}`,
              req.url
            )
          )
        };
      }

      const domain = `${ctx.path.replace('/', '')}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

      trackSite(domain, req, 'PublicHandler');

      return {
        action: 'break',
        name: 'PublicHandler',
        response: NextResponse.rewrite(
          new URL(`/${domain}/`, req.url.replace(ctx.path, ''))
        )
      };
    }

    return { action: 'next', name: 'PublicHandler' };
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
        name: 'WwwHandler',
        response: NextResponse.rewrite(new URL('/home', req.url))
      };
    }

    return { action: 'next', name: 'WwwHandler' };
  }
}

class DefaultRewriteHandler implements MiddlewareHandler {
  async handle(
    req: NextRequest,
    ctx: MiddlewareContext
  ): Promise<HandlerResult> {
    const domain = `${ctx.hostname}${ctx.path}`.trim().replace(/\/$/, '');
    trackSite(domain, req, 'DefaultRewriteHandler');

    return {
      action: 'break',
      name: 'DefaultRewriteHandler',
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
  new ProtectedHandler(),
  new PublicHandler(),
  new WwwHandler(),
  new DefaultRewriteHandler()
];

export default async function middleware(
  req: NextRequest
): Promise<NextResponse | Response> {
  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: req.nextUrl.origin,
      headers: {
        cookie: req.headers.get('cookie') || ''
      }
    }
  );

  const url = req.nextUrl;

  console.time('execution -> ' + url.toString());

  const hostname = normalizeHostname(req);
  const path = buildPath(url);
  // @ts-ignore
  const ctx: MiddlewareContext = { session, hostname, path, url };
  let response: NextResponse | Response | null = null;

  try {
    for (const handler of handlers) {
      const result = await handler.handle(req, ctx);

      console.info('[MIDDLEWARE][NAME]', { handler: result.name });

      if (result.action === 'break') {
        response = result.response;
        break;
      }
    }

    if (!response) response = NextResponse.next();

    console.info('[MIDDLEWARE][RESPONSE]', {
      url: req.url,
      status: response instanceof Response ? response.status : 'unknown',
      redirected:
        response instanceof Response
          ? response.headers.get('Location')
          : undefined
    });

    trackUser(
      `${req.headers.get('host')}${path}`,
      session?.user?.email ?? null,
      req
    );

    return response;
  } catch (err) {
    console.error('[MIDDLEWARE][UNCAUGHT ERROR]', {
      error: err,
      url: req.url,
      hostname
    });

    throw err;
  } finally {
    console.timeEnd('execution -> ' + url.toString());
  }
}
