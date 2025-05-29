'use client';

import type { Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuLoader } from 'react-icons/lu';

import { postData } from 'helpers/api';
import { getStripe } from 'helpers/getStripe';
import useTranslation from 'hooks/use-translation';
import { cn } from 'lib/utils';
import { uri } from 'settings';

export const PriceTableButton = ({
  price
}: {
  price: Prisma.PriceGetPayload<{
    select: {
      id: true;
      metadata: true;
      interval_count: true;
    };
  }>;
}) => {
  const [loading, setLoading] = useState(false);

  const translate = useTranslation();
  const router = useRouter();

  const onClick = async ({
    price
  }: {
    price: Prisma.PriceGetPayload<{
      select: {
        id: true;
        metadata: true;
      };
    }>;
    quantity: number;
  }) => {
    try {
      setLoading(true);

      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: {
          priceId: price.id,
          metadata: price.metadata as Record<string, string>
        }
      });

      (await getStripe())?.redirectToCheckout({ sessionId });
    } catch {
      setLoading(false);
      router.push(uri.app('/register'));
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
        'rounded-md bg-black p-2 text-white uppercase',
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
