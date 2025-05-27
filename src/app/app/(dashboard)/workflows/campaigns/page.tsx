import { LuPlus } from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import CampaignsMutateModal from 'components/modal/mutate-campaign';
import { db } from 'helpers/db';
import { CampaignItem } from './client';

export default async function WorkflowsCampaigns() {
  const campaigns = await db.campaign.findMany({
    include: {
      list: { include: { contacts: true } },
      email: true,
      outboxes: true
    },
    orderBy: { updatedAt: 'desc' }
  });

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
          in: Array.from(
            new Set(
              campaigns
                .filter(({ smart }) => smart === true)
                .flatMap(campaign =>
                  campaign.outboxes.map(outbox => outbox.email)
                )
            )
          )
        }
      }
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
