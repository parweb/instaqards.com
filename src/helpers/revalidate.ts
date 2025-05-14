import { Site } from '@prisma/client';
import { revalidateTag } from 'next/cache';

import { db } from 'helpers/db';

export const revalidate = async (thing: Site) => {
  if (thing.id) {
    await db.site.update({
      where: { id: thing.id },
      data: { updatedAt: new Date() }
    });
  }

  if ('subdomain' in thing && 'customDomain' in thing) {
    thing?.customDomain && revalidateTag(`${thing?.customDomain}-metadata`);
    revalidateTag(
      `${thing?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );
  }
};
