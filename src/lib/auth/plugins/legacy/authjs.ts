import { createAuthMiddleware } from 'better-auth/api';
import { BetterAuthPlugin, HookEndpointContext } from 'better-auth/types';

export const authjs = () => {
  return {
    id: 'authjs',

    hooks: {
      after: [
        {
          matcher(ctx: HookEndpointContext) {
            return ctx.path === '/sign-in/email';
          },
          handler: createAuthMiddleware(async ctx => {
            const newSession = ctx.context.newSession;

            if (!newSession) return;

            const accounts = await ctx.context.internalAdapter.findAccounts(
              newSession.user.id
            );

            const credentials = accounts.find(
              account => account.providerId === 'credential'
            );

            if (!credentials?.password?.startsWith('$2')) return;

            const plain = ctx.body?.password;
            if (!plain) return;
          })
        }
      ]
    }
  } satisfies BetterAuthPlugin;
};
