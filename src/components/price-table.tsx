'use client';

import { Product, Subscription, Price } from '@prisma/client';
import { useState } from 'react';
import { LuLoader } from 'react-icons/lu';

import { getStripe, postData } from 'helpers';
import { cn } from 'lib/utils';

export const PriceTable = ({
  products,
  subscription = null
}: {
  products: (Product & { prices: Price[] })[];
  subscription?: Subscription | null;
}) => {
  const [loading, setLoading] = useState(false);

  const onClick = async ({
    price,
    quantity
  }: {
    price: Price;
    quantity: number;
  }) => {
    try {
      setLoading(true);

      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price, quantity }
      });

      (await getStripe())?.redirectToCheckout({ sessionId });
    } catch (error) {
      setLoading(false);
      alert((error as Error)?.message);
    } finally {
    }
  };

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
              'relative flex-1 flex flex-col gap-4 bg-white scale-90 z-0',
              'border-4 border-black rounded-xl p-10',

              // @ts-ignore
              product?.metadata?.feature === 'true' &&
                !subscription &&
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
                  <div className="">
                    Your plan renews on{' '}
                    <span className="text-white bg-green-600 px-2 py-1 rounded-md">
                      {subscription?.current_period_end.toLocaleDateString()}
                    </span>
                  </div>
                )}

                {subscription?.cancel_at && (
                  <div className="">
                    Your plan will be canceled on{' '}
                    <span className="text-white bg-orange-500 px-2 py-1 rounded-md">
                      {subscription?.cancel_at?.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {!subscription && (
              <button
                disabled={loading}
                onClick={() =>
                  onClick({
                    price: product?.prices?.[0],
                    quantity: product?.prices?.[0].interval_count!
                  })
                }
                className={cn(
                  'flex items-center justify-center',
                  'bg-black rounded-md p-2 text-white uppercase',
                  'transition-all hover:scale-105'
                )}
              >
                {loading ? <LuLoader className="animate-spin" /> : 'buy'}
              </button>
            )}
          </div>
        ))}
    </div>
  );
};
