import { db } from 'helpers/db';
import { marketingRoutes } from 'settings';
import * as job from 'data/job';
import * as feature from 'data/features';
import * as city from 'data/city';

export default async function Sitemap() {
  const sites = await db.site.findMany({ orderBy: { updatedAt: 'desc' } });

  return [
    ...marketingRoutes.map(route => ({
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${route}`,
      lastModified: new Date()
    })),
    ...sites.flatMap(site => [
      {
        url: `https://${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        lastModified: site.updatedAt
      },
      {
        url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${site.subdomain}`,
        lastModified: site.updatedAt
      }
    ]),
    ...job.all.flatMap(job => [
      {
        url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/pro/${job.id}`,
        lastModified: new Date()
      },
      ...city.all.map(city => ({
        url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/pro/${job.id}-${city.name}-${city.postal}`,
        lastModified: new Date()
      }))
    ]),
    ...feature.all.map(feature => ({
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/feature/${feature.id}`,
      lastModified: new Date()
    }))
  ];
}
