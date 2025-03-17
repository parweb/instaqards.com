import type { Prisma, Site, User } from '@prisma/client';
import { SubscriptionStatus } from '@prisma/client';

import { auth } from 'auth';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';

export function getSession() {
  return auth();
}

const isFuture = (date: Date | string) =>
  (typeof date === 'string' ? new Date(date) : date).getTime() >
  new Date().getTime();

const isPast = (date: Date | string) =>
  (typeof date === 'string' ? new Date(date) : date).getTime() <
  new Date().getTime();

type SubscriptionBase = Prisma.SubscriptionGetPayload<{
  include: { price: { include: { product: true } } };
}>;

export class Subscription {
  private user: User | null = null;

  constructor(subscription: SubscriptionBase | null, user: User | null) {
    for (const [key, value] of Object.entries(subscription || {})) {
      // @ts-ignore
      this[key] = value;
    }

    this.user = user;
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

  customerSinceDays(): number {
    const createdAt = this.user?.createdAt
      ? new Date(this.user.createdAt)
      : new Date(Date.now() + 31 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = now.getTime() - createdAt.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  hasTrial(): boolean {
    return (
      // @ts-ignore
      !(this.trial_end === this.trial_start) || this.customerSinceDays() < 30
    );
  }

  onTrial(): boolean {
    return (
      // @ts-ignore
      (this.hasTrial() && this.trial_end && isFuture(this.trial_end)) ||
      this.customerSinceDays() < 30
    );
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
      return { error: translate('auth.error') };
    }

    const site = await db.site.findUnique({
      where: { id: siteId }
    });

    if (
      !site ||
      (site.userId !== session?.user?.id && session.user.role !== 'ADMIN')
    ) {
      return { error: translate('auth.authorized.error') };
    }

    return action(formData, site, key);
  };
}
