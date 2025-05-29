import { UserRole } from '@prisma/client';
import { db } from 'helpers/db';
import { sendCampaignEmail } from 'helpers/sendCampaignEmail';

export async function run() {
  try {
    const campaign = await db.campaign.findFirst({
      where: {
        smart: true,
        active: true
      },
      select: {
        id: true,
        email: {
          select: {
            subject: true,
            content: true
          }
        }
      }
    });

    if (!campaign) {
      return { success: true, message: 'No campaign found' };
    }

    const lead = {
      where: {
        role: UserRole.LEAD,
        outbox: { none: {} }
      }
    };

    const total = await db.user.count(lead);
    const contact = await db.user.findFirst({
      ...lead,
      take: 1,
      skip: Math.floor(Math.random() * total),
      select: {
        email: true,
        sites: {
          select: {
            id: true
          },
          orderBy: [{ updatedAt: 'desc' }]
        }
      }
    });

    if (!contact) {
      return { success: true, message: 'No contact left to send campaign' };
    }

    await sendCampaignEmail(contact, campaign);

    return { success: true, contact, campaign };
  } catch (error) {
    console.error(error);

    return { error };
  }
}
