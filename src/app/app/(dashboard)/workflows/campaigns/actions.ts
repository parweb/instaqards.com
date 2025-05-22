'use server';

import { db } from 'helpers/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const toggleCampaign = async (previous: boolean, form: FormData) => {
  const { active, id } = z
    .object({
      active: z.string().transform(v => v === 'true'),
      id: z.string()
    })
    .parse(Object.fromEntries(form.entries()));

  await db.$transaction(
    async tx => {
      const campaign = await tx.campaign.findUniqueOrThrow({
        where: { id },
        include: {
          list: {
            include: {
              contacts: {
                include: {
                  sites: {
                    select: { id: true },
                    orderBy: [{ updatedAt: 'desc' }]
                  }
                }
              }
            }
          },
          email: { select: { id: true, subject: true, content: true } }
        }
      });

      await tx.campaign.update({
        where: { id: campaign.id },
        data: { active }
      });

      if (campaign.smart === true) return;

      const alreadies = await tx.queue.findMany({
        where: { correlationId: campaign.id }
      });

      if (alreadies.length > 0) {
        await tx.queue.updateMany({
          where: {
            correlationId: campaign.id,
            status: active ? 'frozen' : 'pending'
          },
          data: { status: active ? 'pending' : 'frozen' }
        });
      } else {
        const { list, ...data } = campaign;

        if (list === null) return;

        await tx.queue.createMany({
          data: list.contacts.map(contact => ({
            correlationId: campaign.id,
            status: active ? 'pending' : 'frozen',
            job: 'SEND_EMAIL_CAMPAIGN',
            payload: {
              campaign: {
                ...data,
                list: {
                  ...list,
                  contacts: list.contacts.map(({ id }) => ({ id }))
                }
              },
              contact
            }
          }))
        });
      }
    },
    {
      maxWait: 300_000,
      timeout: 300_000
    }
  );

  revalidatePath('/app/workflows/campaigns');

  return !previous;
};

export const deleteCampaign = async (previous: boolean, form: FormData) => {
  const { id } = z
    .object({ id: z.string() })
    .parse(Object.fromEntries(form.entries()));

  await db.campaign.delete({
    where: { id }
  });

  revalidatePath('/app/workflows/campaigns');

  return !previous;
};
