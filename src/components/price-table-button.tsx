'use client';

import { Price } from '@prisma/client';
import { useState } from 'react';
import { LuLoader } from 'react-icons/lu';

import { getStripe, postData } from 'helpers';
import { cn } from 'lib/utils';

export const PriceTableButton = ({ price }: { price: Price }) => {
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
    <button
      disabled={loading}
      onClick={() => onClick({ price, quantity: price.interval_count! })}
      className={cn(
        'flex items-center justify-center',
        'bg-black rounded-md p-2 text-white uppercase',
        'transition-all hover:scale-105'
      )}
    >
      {loading ? <LuLoader className="animate-spin" /> : 'buy'}
    </button>
  );
};
