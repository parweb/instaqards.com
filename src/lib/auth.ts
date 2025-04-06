import type { Site } from '@prisma/client';

import { auth } from 'auth';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { Subscription } from './Subscription';

export function getSession() {
  return auth();
}

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
      (site.userId !== session?.user?.id && session.user.role !== 'ADMIN')
    ) {
      return { error: await translate('auth.authorized.error') };
    }

    return action(formData, site, key);
  };
}
