'use server';

import { currentUser } from 'helpers/auth';
import { db } from 'helpers/db';
import { headers } from 'next/headers';

export const like = async (
  prevState: { liked: boolean; count: number },
  form: FormData
) => {
  const siteId = String(form.get('siteId'));

  const user = await currentUser();
  const headersList = await headers();

  const ip =
    headersList.get('x-forwarded-host') === 'localhost:11000'
      ? '127.0.0.1'
      : headersList.get('x-forwarded-for');

  console.log({ headers: Object.fromEntries(headersList.entries()), user, ip });

  if (!ip) {
    throw new Error('Unauthorized');
  }

  const exist = await db.like.findFirst({
    where: {
      ip,
      siteId
    }
  });

  if (exist) {
    await db.like.delete({
      where: {
        id: exist.id
      }
    });
  } else {
    await db.like.create({
      data: {
        userId: user?.id,
        ip,
        siteId
      }
    });
  }

  return {
    liked: !prevState.liked,
    count: prevState.count + (!prevState.liked ? 1 : -1)
  };
};
