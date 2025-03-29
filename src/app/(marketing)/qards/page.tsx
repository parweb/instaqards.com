import { db } from 'helpers/db';
import { SiteCard } from './SiteCard';

const QardsPage = async () => {
  const sites = await db.site.findMany({
    include: {
      user: true,
      clicks: true,
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    },
    // take: 20,
    orderBy: { clicks: { _count: 'desc' } },
    where: {
      background: {
        startsWith: 'component:'
      }
    }
  });

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-0 p-0">
      {sites.map(site => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
};

export default QardsPage;
