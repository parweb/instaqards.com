import { User, UserRole } from '@prisma/client';
import { BetterAuthPlugin, HookEndpointContext } from 'better-auth';
import { createAuthMiddleware, sendVerificationEmailFn } from 'better-auth/api';
import { setSessionCookie } from 'better-auth/cookies';

import { hashPassword } from 'better-auth/crypto';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { RegisterSchema } from 'schemas';

export const registerLead = () => {
  return {
    id: 'register-lead',
    hooks: {
      before: [
        {
          matcher(ctx: HookEndpointContext) {
            return ctx.path === '/sign-up/email';
          },
          handler: createAuthMiddleware(async ctx => {
            const { adapter, internalAdapter } = ctx.context;

            const { email, password, name, referer } =
              await RegisterSchema.merge(
                z.object({
                  referer: z
                    .string()
                    .optional()
                    .nullable()
                    .transform(
                      async () => (await cookies()).get('r')?.value ?? undefined
                    )
                })
              ).parseAsync(ctx.body);

            const existingUser =
              (await adapter.findOne<User>({
                model: 'user',
                where: [{ field: 'email', value: email }]
              })) ?? null;

            const role: UserRole = existingUser?.role ?? UserRole.USER;
            const refererId: User['refererId'] =
              existingUser?.refererId ?? null;

            if (existingUser !== null) {
              if (role !== UserRole.LEAD) {
                return { context: ctx };
              }

              const hashedPassword = await hashPassword(password);

              await internalAdapter.updateUser(existingUser.id, {
                name,
                role: UserRole.USER,
                password: hashedPassword,
                emailVerified: false,
                ...(refererId === null && { refererId: referer })
              });

              const session = await internalAdapter.createSession(
                existingUser.id,
                ctx
              );

              await setSessionCookie(ctx, {
                user: { ...existingUser, name },
                session
              });

              await sendVerificationEmailFn(ctx, { ...existingUser, name });

              return ctx.json({
                token: session.token,
                user: {
                  id: existingUser.id,
                  email: existingUser.email,
                  emailVerified: existingUser.emailVerified,
                  name: existingUser.name,
                  image: existingUser.image,
                  createdAt: existingUser.createdAt,
                  updatedAt: existingUser.updatedAt,
                  role: UserRole.USER
                }
              });
            }

            return { context: ctx };
          })
        }
      ]
    }
  } satisfies BetterAuthPlugin;
};
