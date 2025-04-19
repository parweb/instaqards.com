import { db } from 'helpers/db';
import { marketingRoutes } from 'settings';
import * as job from 'data/job';
import * as feature from 'data/features';
import * as city from 'data/city';

export default async function Sitemap() {
  const [sites, allCities] = await Promise.all([
    db.site.findMany({ orderBy: { updatedAt: 'desc' } }),
    city.all()
  ]);

  const marketingUrls = marketingRoutes.map(route => ({
    url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${route}`,
    lastModified: new Date()
  }));

  const siteUrls = sites.flatMap(site => [
    {
      url: `https://${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      lastModified: new Date()
    },
    {
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${site.subdomain}`,
      lastModified: new Date()
    }
  ]);

  const jobUrls = job.all.flatMap(job => [
    {
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/pro/${job.id}`,
      lastModified: new Date()
    },
    ...allCities.map(city => ({
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/pro/${job.id}-${city.slug?.replaceAll('-', '_')}`,
      lastModified: new Date()
    }))
  ]);

  const featureUrls = feature.all.map(feature => ({
    url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/feature/${feature.id}`,
    lastModified: new Date()
  }));

  return [...marketingUrls, ...siteUrls, ...jobUrls, ...featureUrls];
}
