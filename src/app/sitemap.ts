import * as city from 'data/city';
import * as feature from 'data/features';
import * as job from 'data/job';
import { db } from 'helpers/db';
import { marketingRoutes, uri } from 'settings';

export default async function Sitemap() {
  const [sites, allCities] = await Promise.all([
    db.site.findMany({
      select: { subdomain: true },
      orderBy: { updatedAt: 'desc' }
    }),
    city.all()
  ]);

  const marketingUrls = marketingRoutes.map(route => ({
    url: uri.base(route),
    lastModified: new Date()
  }));

  const siteUrls = sites.flatMap(site => [
    {
      url: uri.app('/').replace('app.', `${site.subdomain}.`),
      lastModified: new Date()
    },
    {
      url: uri.base(`/${site.subdomain}`),
      lastModified: new Date()
    }
  ]);

  const jobUrls = job.all.flatMap(job => [
    {
      url: uri.base(`/pro/${job.id}`),
      lastModified: new Date()
    },
    ...allCities.map(city => ({
      url: uri.base(
        `/pro/${job.id}-${city.slug?.replaceAll('-', '_')}-${city.codePostal}`
      ),
      lastModified: new Date()
    }))
  ]);

  const featureUrls = feature.all.map(feature => ({
    url: uri.base(`/feature/${feature.id}`),
    lastModified: new Date()
  }));

  return [...marketingUrls /*, ...siteUrls*/, ...jobUrls, ...featureUrls];
}
