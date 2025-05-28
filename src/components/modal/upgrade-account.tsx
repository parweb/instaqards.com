import type { Prisma } from '@prisma/client';

import { Price } from 'app/(marketing)/home/section/price';
import { Lang } from 'translations';

export default function UpgradeAccountModal({
  lang,
  prices
}: {
  lang: Lang;
  prices: Prisma.PriceGetPayload<{
    select: {
      interval: true;
    };
  }>[];
}) {
  return (
    <form className="">
      <input className="opacity-1" type="text" />

      <Price
        standalone
        begin={false}
        lang={lang}
        prices={prices}
        trial={false}
        border
      />
    </form>
  );
}
