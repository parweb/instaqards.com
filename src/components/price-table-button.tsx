'use client';

import type { Price } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuLoader } from 'react-icons/lu';

import { postData } from 'helpers/api';
import { getStripe } from 'helpers/getStripe';
import useTranslation from 'hooks/use-translation';
import { cn } from 'lib/utils';

export const PriceTableButton = ({ price }: { price: Price }) => {
  const [loading, setLoading] = useState(false);

  const translate = useTranslation();
  const router = useRouter();

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
    } catch {
      setLoading(false);
      router.push(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL as string}/register`);
    } finally {
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => onClick({ price, quantity: Number(price.interval_count) })}
      className={cn(
        'flex items-center justify-center',
        'bg-black rounded-md p-2 text-white uppercase',
        'transition-all hover:scale-105'
      )}
    >
      {loading ? (
        <LuLoader className="animate-spin" />
      ) : (
        translate('components.prices.buy')
      )}
    </button>
  );
};
