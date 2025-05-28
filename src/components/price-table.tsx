import type { Price, Prisma, Product } from '@prisma/client';

import { PriceTableButton } from 'components/price-table-button';
import { translate } from 'helpers/translate';
import type { Subscription } from 'lib/Subscription';
import { cn } from 'lib/utils';

export const PriceTable = ({
  products,
  subscription,
  className
}: {
  products: (Product & { prices: Price[] })[];
  subscription?: Subscription &
    Prisma.SubscriptionGetPayload<{
      include: { price: { include: { product: true } } };
    }>;
  className?: string;
}) => {
  return (
    <div className={cn('flex gap-5', className)}>
      {[...products]
        .sort(
          (left, right) =>
            // @ts-ignore
            Number(left?.metadata?.position) - Number(right?.metadata?.position)
        )
        .map(async product => (
          <div
            key={`PriceTableItem-${product.id}`}
            className={cn(
              'relative flex flex-1 scale-95 flex-col gap-4 bg-white',
              'rounded-xl border-4 border-black p-5 sm:p-10',

              // @ts-ignore
              product?.metadata?.feature === 'true' &&
                !subscription?.valid() &&
                '-mx-7 scale-105 bg-yellow-50',
              subscription?.priceId === product?.prices?.[0]?.id &&
                'border-4 border-green-500 bg-green-100'
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-normal uppercase">
                {product.name}
              </div>

              <div className="text-gray-500">{product?.description}</div>
            </div>

            <div className="text-3xl">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: product?.prices?.[0]?.currency || 'EUR',
                minimumFractionDigits: 0
              }).format((product?.prices?.[0]?.unit_amount || 0) / 100)}
            </div>

            {subscription?.priceId === product?.prices?.[0]?.id && (
              <div className="flex justify-center">
                {!subscription?.cancel_at && (
                  <div className="flex gap-2">
                    <span>
                      {await translate('components.prices.plan.renews')}
                    </span>

                    <span className="rounded-md bg-green-600 px-2 py-1 text-white">
                      {subscription?.current_period_end.toLocaleDateString()}
                    </span>
                  </div>
                )}

                {subscription?.cancel_at && (
                  <div className="">
                    <span>
                      {await translate('components.prices.plan.canceled')}
                    </span>

                    <span className="rounded-md bg-orange-500 px-2 py-1 text-white">
                      {subscription?.cancel_at?.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {!subscription?.valid() && (
              <PriceTableButton price={product?.prices?.[0]} />
            )}
          </div>
        ))}
    </div>
  );
};
