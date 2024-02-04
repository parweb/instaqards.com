import {
  Price,
  Product,
  Site,
  Subscription as SubscriptionPrisma,
  SubscriptionStatus
} from '@prisma/client';

import { auth } from 'auth';
import { db } from 'helpers';

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

class Subscription {
  constructor(subscription: Sub | null) {
    if (subscription === null) return;

    console.log({ subscription });

    Object.entries(subscription).forEach(([key, value]) => {
      // @ts-ignore
      this[key] = value;
    });
  }

  valid(): boolean {
    console.log('valid', {
      'this.active() || this.onTrial() || this.onGracePeriod()':
        this.active() || this.onTrial() || this.onGracePeriod(),
      'this.active() ': this.active(),
      'this.onTrial() ': this.onTrial(),
      'this.onGracePeriod() ': this.onGracePeriod()
    });
    return this.active() || this.onTrial() || this.onGracePeriod();
  }

  incomplete(): boolean {
    console.log('incomplete', {
      "this.status === SubscriptionStatus['incomplete']":
        this.status === SubscriptionStatus['incomplete'],
      'this.status': this.status
    });
    return this.status === SubscriptionStatus['incomplete'];
  }

  pastDue(): boolean {
    console.log('pastDue', {
      "this.status === SubscriptionStatus['past_due']":
        this.status === SubscriptionStatus['past_due'],
      'this.status': this.status
    });
    return this.status === SubscriptionStatus['past_due'];
  }

  active(): boolean {
    console.log('active', {
      'this.ended()': this.ended(),
      'this.status': this.status,

      result:
        !this.ended() &&
        ![
          SubscriptionStatus['incomplete'],
          SubscriptionStatus['incomplete_expired'],
          SubscriptionStatus['past_due'],
          SubscriptionStatus['unpaid'],
          SubscriptionStatus['canceled'],
          SubscriptionStatus['paused']
        ].includes(this.status as never)
    });
    return (
      !this.ended() &&
      ![
        SubscriptionStatus['incomplete'],
        SubscriptionStatus['incomplete_expired'],
        SubscriptionStatus['past_due'],
        SubscriptionStatus['unpaid'],
        SubscriptionStatus['canceled'],
        SubscriptionStatus['paused']
      ].includes(this.status as never)
    );
  }

  hasTrial(): boolean {
    console.log('hasTrial', {
      '!(this.trial_end === this.trial_start)': !(
        this.trial_end === this.trial_start
      ),
      'this.trial_start': this.trial_start,
      'this.trial_end': this.trial_end
    });
    return !(this.trial_end === this.trial_start);
  }

  onTrial(): boolean {
    console.log('onTrial', {
      'this.hasTrial() && this.trial_end && isFuture(this.trial_end)':
        this.hasTrial() && this.trial_end && isFuture(this.trial_end),
      'this.hasTrial()': this.hasTrial(),
      'this.trial_end': this.trial_end
    });
    return this.hasTrial() && this.trial_end && isFuture(this.trial_end);
  }

  hasExpiredTrial(): boolean {
    console.log('onTrial', {
      'this.hasTrial() && this.trial_end && isPast(this.trial_end)':
        this.hasTrial() && this.trial_end && isPast(this.trial_end),
      'this.hasTrial()': this.hasTrial(),
      'this.trial_end': this.trial_end
    });
    return this.hasTrial() && this.trial_end && isPast(this.trial_end);
  }

  onGracePeriod(): boolean {
    console.log('onGracePeriod', {
      'this.ended_at && isFuture(this.ended_at)':
        this.ended_at && isFuture(this.ended_at),
      'this.ended_at': this.ended_at
    });

    return this.ended_at && isFuture(this.ended_at);
  }

  canceled(): boolean {
    console.log('canceled', {
      '!(this.ended_at === null)': !(this.ended_at === null),
      'this.ended_at': this.ended_at
    });
    return !(this.ended_at === null);
  }

  ended(): boolean {
    console.log('ended', {
      'this.canceled() && !this.onGracePeriod()':
        this.canceled() && !this.onGracePeriod()
    });
    return this.canceled() && !this.onGracePeriod();
  }
}

type Option = {
  site?: Site;
};

export async function getSubscription(option?: Option) {
  if (option?.site !== null) {
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
      return {
        error: 'Not authenticated'
      };
    }

    const site = await db.site.findUnique({
      where: {
        id: siteId
      }
    });

    if (!site || site.userId !== session.user.id) {
      return {
        error: 'Not authorized'
      };
    }

    return action(formData, site, key);
  };
}

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null
  ) => {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        error: 'Not authenticated'
      };
    }

    const post = await db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        site: true
      }
    });

    if (!post || post.userId !== session.user.id) {
      return {
        error: 'Post not found'
      };
    }

    return action(formData, post, key);
  };
}
