import type { ReactNode } from 'react';
import { Suspense } from 'react';

import Nav from 'components/nav';
import { PriceTable } from 'components/price-table';
import Profile from 'components/profile';
import { db } from 'helpers/db';
import { getSubscription } from 'lib/auth';

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  const subscription = await getSubscription();

  const products = await db.product.findMany({
    where: { active: { equals: true } },
    include: {
      prices: {
        where: { active: { equals: true }, interval_count: { equals: 1 } }
      }
    }
  });

  return (
    <div>
      <Nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Nav>

      <div className="min-h-screen dark:bg-black sm:pl-60">
        {!subscription.valid() && (
          <div className="px-4 py-8">
            {/* @ts-ignore */}
            <PriceTable products={products} subscription={subscription} />
          </div>
        )}

        <div className="">{children}</div>
      </div>
    </div>
  );
}
