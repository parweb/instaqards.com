import { LuPlus } from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import CampaignsMutateModal from 'components/modal/mutate-campaign';
import { db } from 'helpers/db';
import { CampaignItem } from './client';

export default async function WorkflowsCampaigns() {
  const campaigns = await db.campaign.findMany({
    select: {
      id: true,
      smart: true,
      active: true,
      title: true,
      description: true,
      type: true,
      email: {
        select: {
          id: true
        }
      },
      list: {
        select: {
          id: true,
          contacts: {
            select: {
              id: true,
              email: true,
              phone: true
            }
          }
        }
      },
      outboxes: {
        select: {
          email: true,
          metadata: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  // Récupérer tous les emails des contacts des campagnes
  const allEmails = Array.from(
    new Set([
      // Emails des smart campaigns
      ...campaigns
        .filter(({ smart }) => smart === true)
        .flatMap(campaign => campaign.outboxes.map(outbox => outbox.email)),
      // Emails des regular campaigns
      ...campaigns
        .filter(({ smart }) => smart === false)
        .flatMap(
          campaign =>
            campaign.list?.contacts.map(contact => contact.email) || []
        )
    ])
  );

  const $details = db.$transaction([
    db.outbox.findMany({
      select: {
        id: true,
        status: true,
        metadata: true,
        email: true,
        campaignId: true
      },
      where: { campaignId: { in: campaigns.map(campaign => campaign.id) } }
    }),
    db.queue.findMany({
      select: {
        id: true,
        status: true,
        payload: true,
        correlationId: true
      },
      where: { correlationId: { in: campaigns.map(campaign => campaign.id) } }
    }),
    db.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true
      },
      where: {
        email: {
          in: allEmails
        }
      }
    }),
    db.reservation.findMany({
      select: {
        id: true,
        type: true,
        email: true,
        dateStart: true,
        dateEnd: true,
        comment: true,
        createdAt: true
      },
      where: {
        email: {
          in: allEmails
        },
        type: 'PHONE'
      },
      orderBy: { dateStart: 'desc' }
    })
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ModalButton
          label={
            <>
              <LuPlus /> Add Campaign
            </>
          }
        >
          <CampaignsMutateModal />
        </ModalButton>
      </div>

      <div className="flex flex-col gap-4">
        {campaigns.map(campaign => (
          <CampaignItem
            key={campaign.id}
            campaign={campaign}
            $details={$details}
          />
        ))}
      </div>
    </div>
  );
}
