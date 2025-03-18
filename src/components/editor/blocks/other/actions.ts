'use server';

import { db } from 'helpers/db';

export const subscribe = async (form: FormData) => {
  console.log({ form: Object.fromEntries([...form.entries()]) });

  const email = String(form.get('email'));

  const block = await db.block.findUnique({
    include: {
      site: {
        include: {
          user: true
        }
      }
    },
    where: {
      id: String(form.get('blockId'))
    }
  });

  try {
    const subscriber = await db.subscriber.create({
      data: {
        email,
        siteId: String(block?.siteId)
      }
    });

    return { subscriber };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
