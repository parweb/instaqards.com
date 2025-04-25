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

  const outboxes = await db.outbox.findMany({
    where: { campaignId: { in: campaigns.map(c => c.id) } }
  });

  const queues = await db.queue.findMany({
    where: { correlationId: { in: campaigns.map(c => c.id) } }
  });

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
            outboxes={outboxes}
            queues={queues}
          />
        ))}
      </div>
    </div>
  );
}
