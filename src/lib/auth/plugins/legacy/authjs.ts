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
            console.log({ newSession });
            if (!newSession) return;

            const accounts = await ctx.context.internalAdapter.findAccounts(
              newSession.user.id
            );

            console.log({ accounts });

            const credentials = accounts.find(
              account => account.providerId === 'credential'
            );
            console.log({ credentials });
            if (!credentials?.password?.startsWith('$2')) return;

            const plain = ctx.body?.password;
            console.log({ plain });
            if (!plain) return;

            const newHash = await ctx.context.password.hash(plain);
            console.log({ newHash });
            console.log({
              updatePassword: await ctx.context.internalAdapter.updatePassword(
                newSession.user.id,
                newHash
              )
            });
          })
        }
      ]
    }
  } satisfies BetterAuthPlugin;
};
