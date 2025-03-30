import { SubscriptionStatus, type Prisma, type User } from '@prisma/client';

export const isFuture = (date: Date | string) =>
  (typeof date === 'string' ? new Date(date) : date).getTime() >
  new Date().getTime();

export const isPast = (date: Date | string) =>
  (typeof date === 'string' ? new Date(date) : date).getTime() <
  new Date().getTime();

export type SubscriptionBase = Prisma.SubscriptionGetPayload<{
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
