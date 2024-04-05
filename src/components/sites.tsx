import { User } from '@prisma/client';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { db } from 'helpers';
import { getSession } from 'lib/auth';
import SiteCard from 'components/site-card';
import { translate } from 'helpers/translate';

export default async function Sites({
  limit,
  userId = null
}: {
  limit?: number;
  userId?: User['id'] | null;
}) {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const sites = await db.site.findMany({
    where: {
      user: {
        id: userId || session.user.id!
      }
    },
    orderBy: {
      createdAt: 'asc'
    },
    ...(limit ? { take: limit } : {})
  });

  return sites.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sites.map(site => (
        <SiteCard key={site.id} data={site} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">
        {translate('components.sites.empty.title')}
      </h1>

      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />

      <p className="text-lg text-stone-500">
        {translate('components.sites.empty.description')}
      </p>
    </div>
  );
}
