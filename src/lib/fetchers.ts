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
        select: {
          id: true,
          background: true,
          customDomain: true,
          name: true,
          description: true,
          image: true,
          logo: true,
          userId: true,
          user: { select: { id: true } },
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
