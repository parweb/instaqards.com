import { db } from 'helpers/db';
import { SiteCard } from './SiteCard';
import { headers } from 'next/headers';

const QardsPage = async () => {
  const headersList = await headers();

  const ip =
    headersList.get('x-forwarded-host') === 'localhost:11000'
      ? '127.0.0.1'
      : (headersList.get('x-forwarded-for') ?? 'none');

  const sites = await db.site.findMany({
    include: {
      user: true,
      clicks: true,
      likes: true,
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    },
    // take: 5,
    orderBy: { clicks: { _count: 'desc' } }
    // where: {
    //   background: {
    //     startsWith: 'component:'
    //   }
    // }
  });

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-0 p-0">
      {sites.map(site => (
        <SiteCard key={site.id} site={site} ip={ip} />
      ))}
    </div>
  );
};

export default QardsPage;
