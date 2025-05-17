import { UserRole, type Site } from '@prisma/client';
import { compare } from 'bcryptjs';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { hashPassword, verifyPassword } from 'better-auth/crypto';
import { nextCookies } from 'better-auth/next-js';
import { anonymous, emailOTP, magicLink } from 'better-auth/plugins';
import { headers } from 'next/headers';

import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { Subscription } from 'lib/Subscription';
import { uri } from 'settings';
import { authjs } from './plugins/legacy/authjs';
import { registerLead } from './plugins/register-lead';

import {
  sendMagicLinkEmail,
  sendPasswordResetEmail,
  sendVerificationEmail
} from 'helpers/mail';

export const auth = betterAuth({
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: uri.cookie
    }
  },
  plugins: [
    authjs(),
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log('lib/auth::emailOTP::sendVerificationOTP', {
          email,
          otp,
          type
        });

        const mapper: Record<
          typeof type,
          (email: string, otp: string) => Promise<void>
        > = {
          'sign-in': sendVerificationEmail,
          'email-verification': sendVerificationEmail,
          'forget-password': sendPasswordResetEmail
        };

        if (!mapper[type]) {
          throw new Error('Invalid type' + type);
        }

        return mapper[type](email, otp);
      }
    }),
    registerLead(),
    magicLink({
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      sendMagicLink: async ({ email, url }) => {
        console.log('lib/auth::magicLink::sendMagicLink', {
          email,
          url
        });

        await sendMagicLinkEmail(email, url);
      }
    }),
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await db.$transaction([
          db.site.updateMany({
            where: { userId: anonymousUser.user.id },
            data: { userId: newUser.user.id }
          }),
          db.event.updateMany({
            where: { userId: anonymousUser.user.id },
            data: { userId: newUser.user.id }
          }),
          db.click.updateMany({
            where: { userId: anonymousUser.user.id },
            data: { userId: newUser.user.id }
          })
        ]);
      }
    })
  ],
  database: prismaAdapter(db, { provider: 'postgresql' }),
  emailVerification: {
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      console.log('lib/auth::emailVerification::sendVerificationEmail', {
        user,
        url
      });

      await sendVerificationEmail(
        user.email,
        url.replace(
          'callbackURL=/',
          `${new URLSearchParams({
            callbackURL: uri.app()
          })}`
        )
      );
    }
  },
  trustedOrigins: [
    'http://app.qards.local:11000',
    'http://qards.local:11000',
    'http://app.qards.local',
    'http://qards.local',
    'https://app.qards.link',
    'https://qards.link'
  ],
  user: {
    additionalFields: {
      role: {
        type: Object.values(UserRole),
        nullable: true,
        default: UserRole.USER
      },
      affiliateRate: {
        type: 'number',
        nullable: true,
        default: 0.05
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendOnSignUp: true,
    requireEmailVerification: true,
    password: {
      hash: hashPassword,
      verify: async ({
        hash,
        password
      }: {
        hash: string;
        password: string;
      }) => {
        if (hash.startsWith('$2')) {
          // bcrypt signature
          return compare(password, hash); // bcryptjs
        }

        return verifyPassword({ hash, password });
      }
    },
    sendResetPassword: async ({ user, url, token }) => {
      console.log('lib/auth::emailAndPassword::sendResetPassword', {
        user,
        url,
        token
      });

      await sendPasswordResetEmail(user.email, url);
    }
  },
  session: {
    fields: {
      expiresAt: 'expires',
      token: 'sessionToken'
    }
  },
  account: {
    fields: {
      accountId: 'providerAccountId',
      refreshToken: 'refresh_token',
      accessToken: 'access_token',
      accessTokenExpiresAt: 'access_token_expires',
      idToken: 'id_token'
    }
  }
});

export const getSession = async () => {
  return auth.api.getSession({
    headers: await headers()
  });
};

export async function getRole() {
  const session = await getSession();
  return session?.user?.role ?? null;
}

type Option = {
  site?: Site;
};

export async function getSubscription(option?: Option) {
  if (option?.site) {
    const subscription = await db.subscription.findFirst({
      include: { price: { include: { product: true } } },
      where: {
        user: { sites: { some: { id: option?.site?.id } } },
        status: { in: ['trialing', 'active'] }
      }
    });

    const user = option.site.userId
      ? await db.user.findUnique({
          where: {
            id: option.site.userId
          }
        })
      : null;

    return new Subscription(subscription, user);
  }

  const session = await getSession();

  if (!session || !session?.user) {
    throw new Error('Your are not logged in');
  }

  return new Subscription(
    await db.subscription.findFirst({
      include: { price: { include: { product: true } } },
      where: {
        user: { id: session.user.id },
        status: { in: ['trialing', 'active'] }
      }
    }),
    session.user.id
      ? await db.user.findUnique({
          where: {
            id: session.user.id
          }
        })
      : null
  );
}

export async function isPaid() {
  const subscription = await getSubscription();

  return subscription;
}

export function withSiteAuth<T>(
  action: (
    form: FormData, // eslint-disable-line no-unused-vars
    site: Site, // eslint-disable-line no-unused-vars
    key: string | null // eslint-disable-line no-unused-vars
  ) => Promise<{ error: string } | T>
) {
  return async (
    formData: FormData,
    siteId: string,
    key: string | null
  ): Promise<{ error: string } | T> => {
    const session = await getSession();

    if (!session || !session?.user) {
      return { error: await translate('auth.error') };
    }

    const site = await db.site.findUnique({
      where: { id: siteId }
    });

    if (
      !site ||
      (site.userId !== session?.user?.id &&
        !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
          session.user.role
        ))
    ) {
      return { error: await translate('auth.authorized.error') };
    }

    return action(formData, site, key);
  };
}
