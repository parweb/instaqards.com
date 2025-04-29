import { Site } from '@prisma/client';
import { revalidateTag } from 'next/cache';

export const revalidate = (thing: Site) => {
  if ('subdomain' in thing && 'customDomain' in thing) {
    thing?.customDomain && revalidateTag(`${thing?.customDomain}-metadata`);
    revalidateTag(
      `${thing?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );
  }
};
