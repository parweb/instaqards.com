import { db } from 'helpers/db';

export default async function Sitemap() {
  const sites = await db.site.findMany({ orderBy: { updatedAt: 'desc' } });

  return [
    {
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      lastModified: new Date()
    },
    ...sites.map(site => ({
      url: `https://${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      lastModified: site.updatedAt
    }))
  ];
}
