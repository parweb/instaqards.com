import { unstable_cache } from 'next/cache';

import { db } from 'helpers/db';

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '')
    : null;

  console.log({
    hey: {
      where: subdomain
        ? { subdomain: subdomain }
        : { customDomain: domain.toLowerCase() },
      include: {
        user: true,
        blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
      }
    }
  });

  return db.site
    .findUnique({
      where: subdomain
        ? { subdomain: subdomain.toLowerCase() }
        : { customDomain: domain.toLowerCase() },
      include: {
        user: true,
        blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
      }
    })
    .catch(error => {
      console.error({ plop: error });
      return null;
    });

  return await unstable_cache(
    async () => {
      console.log({
        where: subdomain
          ? { subdomain: subdomain.toLowerCase() }
          : { customDomain: domain.toLowerCase() },
        include: {
          user: true,
          blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
        }
      });
      return db.site.findUnique({
        where: subdomain
          ? { subdomain: subdomain.toLowerCase() }
          : { customDomain: domain.toLowerCase() },
        include: {
          user: true,
          blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
        }
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`]
    }
  )();
}
