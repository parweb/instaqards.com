import Form from 'next/form';
import { IconType } from 'react-icons';
import { z } from 'zod';

import {
  LuExternalLink,
  LuPause,
  LuPencil,
  LuPlay,
  LuPlus,
  LuPointer,
  LuUser
} from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import CampaignsMutateModal from 'components/modal/mutate-campaign';
import { Button } from 'components/ui/button';
import { db } from 'helpers/db';
import { revalidatePath } from 'next/cache';

const Stat = ({
  label,
  value,
  Icon
}: {
  label: string;
  value: number;
  Icon: IconType;
}) => (
  <div className="flex gap-4 items-center border rounded-md px-4 py-2 shadow-sm">
    <div className="flex items-center justify-center bg-stone-100 rounded-full p-4">
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <h4 className="text-muted-foreground">{label}</h4>
      <span className="font-medium">{value}</span>
    </div>
  </div>
);

export default async function WorkflowsCampaigns() {
  const campaigns = await db.campaign.findMany({
    include: { list: { include: { contacts: true } }, email: true },
    orderBy: { updatedAt: 'desc' }
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
          <div
            key={campaign.id}
            className="flex items-center justify-between border p-4 rounded-md gap-4"
          >
            <div className="aspect-square w-15 border rounded-md p-4 flex items-center justify-center">
              {campaign.list.contacts.length}
            </div>

            <div className="flex-1">
              <div className="font-medium">{campaign.title}</div>
              <div className="text-muted-foreground">
                {campaign.description}
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Stat label="Envoyé" value={10} Icon={LuUser} />
              <Stat label="Ouverture" value={10} Icon={LuExternalLink} />
              <Stat label="Clicks" value={16} Icon={LuPointer} />
            </div>

            <div className="flex gap-2 items-center">
              <ModalButton label={<LuPencil />}>
                <CampaignsMutateModal campaign={campaign} />
              </ModalButton>

              <Form
                action={async form => {
                  'use server';

                  const { active } = z
                    .object({
                      active: z.string().transform(v => v === 'true')
                    })
                    .parse(Object.fromEntries(form.entries()));

                  await db.campaign.update({
                    where: { id: campaign.id },
                    data: { active }
                  });

                  revalidatePath('/app/workflows/campaigns');
                }}
              >
                {campaign.active === false && (
                  <Button
                    type="submit"
                    name="active"
                    value="true"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <LuPlay />
                  </Button>
                )}

                {campaign.active === true && (
                  <Button
                    type="submit"
                    name="active"
                    value="false"
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <LuPause />
                  </Button>
                )}
              </Form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
