import { headers } from 'next/headers';
import { Suspense } from 'react';

import { db } from 'helpers/db';
import { SiteCard } from '../SiteCard';

const QardsPage = async () => {
  const headersList = await headers();

  const ip = ['qards.local', 'qards.local:11000', 'localhost:11000'].includes(
    String(headersList.get('x-forwarded-host'))
  )
    ? '127.0.0.1'
    : (headersList.get('x-forwarded-for') ?? 'none');

  const sites = await db.site.findMany({
    orderBy: { clicks: { _count: 'desc' } },
    select: {
      id: true,
      subdomain: true,
      background: true,
      likes: { select: { ip: true } },
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    }
  });

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-0 p-0 sm:gap-4 sm:p-4">
      {sites.map(site => (
        <Suspense key={site.id} fallback={null}>
          <SiteCard site={site} ip={ip} />
        </Suspense>
      ))}
    </div>
  );
};

export default QardsPage;
