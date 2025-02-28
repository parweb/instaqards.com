import type {
  Price,
  Product,
  Subscription as SubscriptionPrisma
} from '@prisma/client';

import { PriceTableButton } from 'components/price-table-button';
import { translate } from 'helpers/translate';
import type { Subscription } from 'lib/auth';
import { cn } from 'lib/utils';

export const PriceTable = ({
  products,
  subscription
}: {
  products: (Product & { prices: Price[] })[];
  subscription?: Subscription & SubscriptionPrisma;
}) => {
  return (
    <div className="flex gap-5">
      {[...products]
        .sort(
          (left, right) =>
            // @ts-ignore
            Number(left?.metadata?.position) - Number(right?.metadata?.position)
        )
        .map(product => (
          <div
            key={`PriceTableItem-${product.id}`}
            className={cn(
              'relative flex-1 flex flex-col gap-4 bg-white scale-90 z-1',
              'border-4 border-black rounded-xl p-5 sm:p-10',

              // @ts-ignore
              product?.metadata?.feature === 'true' &&
                !subscription?.valid() &&
                'scale-110 -mx-7 z-10 bg-yellow-50',
              subscription?.priceId === product?.prices?.[0]?.id &&
                'z-10 bg-green-100 border-4 border-green-500'
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="font-normal text-2xl uppercase">
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
                    <span>{translate('components.prices.plan.renews')}</span>

                    <span className="text-white bg-green-600 px-2 py-1 rounded-md">
                      {subscription?.current_period_end.toLocaleDateString()}
                    </span>
                  </div>
                )}

                {subscription?.cancel_at && (
                  <div className="">
                    <span>{translate('components.prices.plan.canceled')}</span>

                    <span className="text-white bg-orange-500 px-2 py-1 rounded-md">
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
