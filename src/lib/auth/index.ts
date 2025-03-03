import type { Prisma, User } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { anonymous } from 'better-auth/plugins/anonymous';
import { multiSession } from 'better-auth/plugins/multi-session';
import { organization } from 'better-auth/plugins/organization';
import { passkey } from 'better-auth/plugins/passkey';

import { ac, admin, member, owner } from '@/lib/auth/permissions';
import { stripe } from '@/lib/payments/stripe';
import { db } from '@/lib/prisma';
// import { resend } from "@/lib/resend";

export const auth = betterAuth({
  // trustedOrigins: [process.env.BETTER_AUTH_URL!],
  database: prismaAdapter(db, { provider: 'postgresql' }),
  session: { freshAge: 0 },
  // emailVerification: {
  //   async sendVerificationEmail({ user, url }) {
  //     const res = await resend.emails.send({
  //       from: "no-reply@keyboard.sh",
  //       to: user.email,
  //       subject: "Verify your email address",
  //       html: `<a href="${url}">Verify your email address</a>`,
  //     });

  //     console.log(res, user.email);
  //   },
  // },
  account: {
    accountLinking: { trustedProviders: ['google', 'github'] }
  },
  plugins: [
    organization({
      ac: ac,
      roles: { owner, admin, member }
      // allowUserToCreateOrganization: async user => {
      //   // Fetch the user's active organization ID (assuming you store this in the session)

      //   const session = await prisma.session.findFirst({
      //     include: {
      //       organization: {
      //         include: { subscription: true }
      //       },
      //       user: { include: { sessions: true } }
      //     },
      //     where: {
      //       userId: user.id
      //     }
      //   });

      //   if (!session) {
      //     return false;
      //   }

      //   // Fetch the organization and its subscription details
      //   const organization = session.organization;

      //   // Check if the subscription is valid (replace with your logic)
      //   const isSubscriptionValid = Organization.isSubscribed(organization);

      //   return isSubscriptionValid; // Only allow creation if the subscription is valid
      // }
    }),
    multiSession(),
    nextCookies(),
    passkey({
      rpID: process.env.BETTER_AUTH_PASSKEY_ID as string,
      rpName: process.env.BETTER_AUTH_PASSKEY_NAME as string
    }),
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        console.log({ anonymousUser, newUser });
      }
    })
  ],
  emailAndPassword: {
    enabled: true
    // async sendResetPassword({ user, url }) {
    //   await resend.emails.send({
    //     from: "no-reply@keyboard.sh",
    //     to: user.email,
    //     subject: "Reset your password",
    //     react: reactResetPasswordEmail({
    //       username: user.email,
    //       resetLink: url,
    //     }),
    //   });
    // },
  },
  socialProviders: {
    // facebook: {
    //   clientId: process.env.FACEBOOK_CLIENT_ID || "",
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    // },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
    }
    // google: {
    //   clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // },
    // discord: {
    //   clientId: process.env.DISCORD_CLIENT_ID || "",
    //   clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    // },
    // microsoft: {
    //   clientId: process.env.MICROSOFT_CLIENT_ID || "",
    //   clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
    // },
    // twitch: {
    //   clientId: process.env.TWITCH_CLIENT_ID || "",
    //   clientSecret: process.env.TWITCH_CLIENT_SECRET || "",
    // },
    // twitter: {
    //   clientId: process.env.TWITTER_CLIENT_ID || "",
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
    // },
  },

  databaseHooks: {
    session: {
      create: {
        before: async session => {
          // get last session for the user
          const lastSession = await db.session.findFirst({
            where: { userId: session.userId },
            orderBy: { createdAt: 'desc' },
            select: { activeOrganizationId: true }
          });

          const organization =
            lastSession === null
              ? await db.organization.findFirst({
                where: { members: { some: { userId: session.userId } } },
                select: { id: true }
              })
              : { id: lastSession.activeOrganizationId };

          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id
            }
          };
        }
      }
    },
    user: {
      create: {
        after: async user => {
          const member = await db.member.create({
            data: {
              role: 'admin',
              organization: {
                create: { name: 'default', slug: 'default' }
              },
              user: {
                connect: { id: user.id }
              }
            }
          });

          const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
              ...member,
              createdAt: member.createdAt.toISOString(),
            }
          });

          await db.organization.update({
            where: { id: member.organizationId },
            data: { stripeCustomerId: customer.id }
          });
        }
      }
    }
  }
});

type Ko<ErrorType extends Error = Error> = [false, ErrorType];
type Ok<Type> = [true, Type];
type Result<Type> = Ko<Error> | Ok<Type>;

const ok = <Type>(value: Type): Ok<Type> => [true, value];
const ko = <ErrorType extends Error = Error>(
  error: ErrorType
): Ko<ErrorType> => [false, error];

const includes = {
  include: {
    organization: {
      include: { subscription: true }
    },
    user: { include: { sessions: true } }
  }
} as const;

type Can = (
  actions: string | string[],
  resource: string,
  options?: {
    onDeny?: (error: Error) => void;
  }
) => Promise<boolean>;

export type AuthUser = User & {
  isAnonymous: boolean;
  can: Can;
  session: Prisma.SessionGetPayload<typeof includes>;
  organization: Prisma.OrganizationGetPayload<
    typeof includes.include.organization
  >;
  subscription: Prisma.SubscriptionGetPayload<
    typeof includes.include.organization.include.subscription
  > | null;
};

export const get = async (headers: Headers): Promise<Result<AuthUser>> => {
  try {
    const session = await auth.api.getSession({ headers });

    if (session === null) {
      throw new Error('Session not found');
    }

    const me = await db.session.findUniqueOrThrow({
      ...includes,
      where: {
        id: session.session.id
      }
    });

    return ok({
      ...me.user,
      isAnonymous: me.user.isAnonymous ?? false,
      organization: me.organization,
      session: me,
      subscription: me.organization.subscription,
      can: async (actions, resource, options) => {
        try {
          const hasPermission = await auth.api.hasPermission({
            headers,
            body: {
              permission: {
                [resource]: typeof actions === 'string' ? [actions] : actions
              }
            }
          });

          console.log('me.can()', { actions, resource, result: hasPermission });

          if (hasPermission.error) {
            throw new Error(hasPermission.error);
          }

          if (hasPermission.success === false) {
            throw new Error('Permission denied');
          }

          return hasPermission.success;
        } catch (error: unknown) {
          options?.onDeny?.(error as Error);

          return false;
        }
      }
    });
  } catch (error) {
    return ko(error as Error);
  }
};
