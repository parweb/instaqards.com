import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

import {
  type Price,
  type Product,
  type Site,
  type Subscription as SubscriptionPrisma,
  SubscriptionStatus
} from '@prisma/client';

import { auth as nextAuth } from 'auth';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';

export function getSession() {
  return nextAuth();
}

const isFuture = (date: Date | string) =>
  (typeof date === 'string' ? new Date(date) : date).getTime() >
  new Date().getTime();

const isPast = (date: Date | string) =>
  (typeof date === 'string' ? new Date(date) : date).getTime() <
  new Date().getTime();

type Sub = SubscriptionPrisma & { price: Price & { product: Product } };

export class Subscription {
  constructor(subscription: Sub | null) {
    if (subscription === null) return;

    for (const [key, value] of Object.entries(subscription)) {
      // @ts-ignore
      this[key] = value;
    }
  }

  valid(): boolean {
    return this.active() || this.onTrial() || this.onGracePeriod();
  }

  incomplete(): boolean {
    // @ts-ignore
    return this.status === SubscriptionStatus.incomplete;
  }

  pastDue(): boolean {
    // @ts-ignore
    return this.status === SubscriptionStatus.past_due;
  }

  active(): boolean {
    return (
      !this.ended() &&
      ![
        SubscriptionStatus.incomplete,
        SubscriptionStatus.incomplete_expired,
        SubscriptionStatus.past_due,
        SubscriptionStatus.unpaid,
        SubscriptionStatus.canceled,
        SubscriptionStatus.paused
        // @ts-ignore
      ].includes(this.status as never)
    );
  }

  hasTrial(): boolean {
    // @ts-ignore
    return !(this.trial_end === this.trial_start);
  }

  onTrial(): boolean {
    // @ts-ignore
    return this.hasTrial() && this.trial_end && isFuture(this.trial_end);
  }

  hasExpiredTrial(): boolean {
    // @ts-ignore
    return this.hasTrial() && this.trial_end && isPast(this.trial_end);
  }

  onGracePeriod(): boolean {
    // @ts-ignore
    return this.ended_at && isFuture(this.ended_at);
  }

  canceled(): boolean {
    // @ts-ignore
    return !(this.ended_at === null);
  }

  ended(): boolean {
    return this.canceled() && !this.onGracePeriod();
  }
}

type Option = {
  site?: Site;
};

export async function getSubscription(option?: Option) {
  if (option?.site) {
    return new Subscription(
      await db.subscription.findFirst({
        include: { price: { include: { product: true } } },
        where: {
          user: { sites: { some: { id: option?.site?.id } } },
          status: { in: ['trialing', 'active'] }
        }
      })
    );
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
    })
  );
}

export async function isPaid() {
  const subscription = await getSubscription();

  return subscription;
}

export function withSiteAuth<T>(
  action: (
    form: FormData,
    site: Site,
    key: string | null
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
      (site.userId !== session?.user?.id && session.user.role !== 'ADMIN')
    ) {
      return { error: await translate('auth.authorized.error') };
    }

    return action(formData, site, key);
  };
}

export const auth = betterAuth({
  plugins: [nextCookies()],
  database: prismaAdapter(db, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true
  },
  session: {
    fields: {
      expiresAt: "expires",
      token: "sessionToken"
    }
  },
  accounts: {
    fields: {
      accountId: "providerAccountId",
      refreshToken: "refresh_token",
      accessToken: "access_token",
      accessTokenExpiresAt: "access_token_expires",
      idToken: "id_token",
    }
  },
});
