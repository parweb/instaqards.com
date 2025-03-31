import { db } from 'helpers/db';
import { marketingRoutes } from 'settings';

export default async function Sitemap() {
  const sites = await db.site.findMany({ orderBy: { updatedAt: 'desc' } });

  return [
    ...marketingRoutes.map(route => ({
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${route}`,
      lastModified: new Date()
    })),
    ...sites.map(site => ({
      url: `https://${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      lastModified: site.updatedAt
    }))
  ];
}
