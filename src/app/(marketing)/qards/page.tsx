import { headers } from 'next/headers';
import { Suspense } from 'react';

import { db } from 'helpers/db';
import { SiteCard } from './SiteCard';

// const range = (start: number, end: number) => {
//   return Array.from({ length: end - start + 1 }, (_, i) => start + i);
// };

const QardsPage = async () => {
  // const sites = await db.site.findMany();
  // for (const site of sites) {
  //   await db.like.createMany({
  //     data: range(30, Math.floor(Math.random() * 100)).map(i => ({
  //       ip: nanoid(),
  //       siteId: site.id
  //     }))
  //   });
  // }
  // return null;

  const headersList = await headers();

  const ip = ['qards.local', 'qards.local:11000', 'localhost:11000'].includes(
    String(headersList.get('x-forwarded-host'))
  )
    ? '127.0.0.1'
    : (headersList.get('x-forwarded-for') ?? 'none');

  const sites = await db.site.findMany({
    include: {
      user: true,
      clicks: true,
      likes: true,
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    },
    // take: 4,
    orderBy: { clicks: { _count: 'desc' } }
    // where: {
    //   user: {
    //     id: 'cljxegubd0000xiugs1tqdjdu'
    //   }
    // }
    // where: {
    //   background: {
    //     startsWith: 'component:'
    //   }
    // }
  });

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-0 p-0">
      {sites.map(site => (
        <Suspense key={site.id} fallback={null}>
          <SiteCard site={site} ip={ip} />
        </Suspense>
      ))}
    </div>
  );
};

export default QardsPage;
