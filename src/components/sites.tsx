import type { User } from '@prisma/client';
import Image from 'next/image';

import SiteCard from 'components/site-card';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getAuth } from 'lib/auth';

export default async function Sites({
  limit,
  userId = null
}: {
  limit?: number;
  userId?: User['id'] | null;
}) {
  const sites = await db.site.findMany({
    select: {
      id: true,
      subdomain: true,
      name: true,
      description: true,
      _count: { select: { clicks: true } }
    },
    orderBy: { createdAt: 'asc' },
    ...(limit ? { take: limit } : {}),
    where: {
      user: {
        id: userId || (await getAuth()).id
      }
    }
  });

  return sites.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sites.map(site => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">
        {await translate('components.sites.empty.title')}
      </h1>

      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />

      <p className="text-lg text-stone-500">
        {await translate('components.sites.empty.description')}
      </p>
    </div>
  );
}
