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
        where: {
          active: { equals: true },
          interval_count: { equals: 1 }
        }
      }
    }
  });

  return (
    <div className="flex flex-1 self-stretch">
      <Nav>
        <Suspense fallback={null}>
          <Profile />
        </Suspense>
      </Nav>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {!subscription.valid() && (
          <div className="px-4 py-8">
            {/* @ts-ignore */}
            <PriceTable products={products} subscription={subscription} />
          </div>
        )}

        {subscription.hasTrial() && subscription.customerSinceDays() && (
          <div className="p-6 bg-lime-700 text-white sticky top-0">
            {30 - subscription.customerSinceDays()} days left in your trial
          </div>
        )}

        <div className="flex flex-col flex-1 self-stretch">{children}</div>
      </div>
    </div>
  );
}
