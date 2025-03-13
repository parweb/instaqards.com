import { unstable_cache } from 'next/cache';

import { db } from 'helpers/db';

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '')
    : null;

  return await unstable_cache(
    async () => {
      return db.site.findUnique({
        where: subdomain
          ? { subdomain: subdomain.toLowerCase() }
          : { customDomain: domain.toLowerCase() },
        include: {
          user: true,
          blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'desc' }] }
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
