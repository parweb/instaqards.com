'use server';

import { db } from 'helpers/db';

export const subscribe = async (form: FormData) => {
  console.info({ form: Object.fromEntries([...form.entries()]) });

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
    console.error({ error });
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const book = async (form: FormData) => {
  console.info({ form: Object.fromEntries([...form.entries()]) });

  const blockId = String(form.get('blockId'));

  const block = await db.block.findUnique({
    where: { id: blockId }
  });

  // @ts-ignore
  if (!block || block.widget?.id !== 'reservation') {
    return { error: 'Block not found' };
  }

  const day = String(form.get('day'));
  const time = String(form.get('time'));
  const email = String(form.get('email'));
  const name = String(form.get('name'));
  const comment = String(form.get('comment'));
  const timeSlotInterval = Number(form.get('timeSlotInterval'));

  try {
    const reservation = await db.reservation.create({
      include: { block: true },
      data: {
        name,
        email,
        comment,
        dateStart: new Date(`${day} ${time}`),
        dateEnd: new Date(
          new Date(`${day} ${time}`).getTime() + timeSlotInterval * 60000
        ),
        block: { connect: { id: block.id } }
      }
    });

    return { reservation };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
