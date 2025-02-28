import { unstable_cache } from 'next/cache';

import { db } from 'helpers/db';

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '')
    : null;

  return await unstable_cache(
    async () => {
      return db.site.findUnique({
        where: subdomain ? { subdomain } : { customDomain: domain },
        include: {
          user: true,
          links: {
            orderBy: {
              createdAt: 'asc'
            }
          }
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
