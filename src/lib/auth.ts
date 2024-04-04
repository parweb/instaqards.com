import {
  Price,
  Product,
  Site,
  Subscription as SubscriptionPrisma,
  SubscriptionStatus,
  UserRole
} from '@prisma/client';

import { auth } from 'auth';
import { db } from 'helpers';
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

type Sub = SubscriptionPrisma & { price: Price & { product: Product } };

export class Subscription {
  constructor(subscription: Sub | null) {
    if (subscription === null) return;

    Object.entries(subscription).forEach(([key, value]) => {
      // @ts-ignore
      this[key] = value;
    });
  }

  valid(): boolean {
    return this.active() || this.onTrial() || this.onGracePeriod();
  }

  incomplete(): boolean {
    // @ts-ignore
    return this.status === SubscriptionStatus['incomplete'];
  }

  pastDue(): boolean {
    // @ts-ignore
    return this.status === SubscriptionStatus['past_due'];
  }

  active(): boolean {
    return (
      !this.ended() &&
      ![
        SubscriptionStatus['incomplete'],
        SubscriptionStatus['incomplete_expired'],
        SubscriptionStatus['past_due'],
        SubscriptionStatus['unpaid'],
        SubscriptionStatus['canceled'],
        SubscriptionStatus['paused']
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
  if (!!option?.site) {
    return new Subscription(
      await db.subscription.findFirst({
        include: { price: { include: { product: true } } },
        where: {
          user: { sites: { some: { id: option?.site?.id } } },
          status: { in: ['trialing', 'active'] }
        }
      })
    );
  } else {
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
}

export async function isPaid() {
  const subscription = await getSubscription();

  return subscription;
}

export function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null
  ) => {
    const session = await getSession();

    if (!session || !session?.user) {
      return { error: translate('auth.error') };
    }

    const site = await db.site.findUnique({
      where: { id: siteId }
    });

    if (
      !site ||
      (site.userId !== session?.user?.id &&
        session.user.role !== UserRole.ADMIN)
    ) {
      return { error: translate('auth.authorized.error') };
    }

    return action(formData, site, key);
  };
}
