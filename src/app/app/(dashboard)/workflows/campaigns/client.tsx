'use client';

import { Outbox, Prisma, Queue } from '@prisma/client';
import { LucideLoader2 } from 'lucide-react';
import { interpolate } from 'motion';
import Link from 'next/link';
import { Suspense, use, useActionState, useState } from 'react';
import { IconType } from 'react-icons';

import {
  LuChevronDown,
  LuChevronUp,
  LuCopy,
  LuEllipsisVertical,
  LuExternalLink,
  LuLoader,
  LuPause,
  LuPencil,
  LuPlay,
  LuPointer,
  LuTrash,
  LuUser
} from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import CampaignsMutateModal from 'components/modal/mutate-campaign';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';
import { deleteCampaign, toggleCampaign } from './actions';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'components/ui/dropdown-menu';

const Stat = ({
  label,
  value,
  total,
  Icon
}: {
  label: string;
  value: number;
  total?: number;
  Icon: IconType;
}) => (
  <div className="border rounded-md shadow-sm">
    <div className="rounded-md overflow-hidden">
      <div className="flex gap-4 items-center px-4 py-2">
        <div className="flex items-center justify-center bg-stone-100 rounded-full p-4">
          <Icon className="w-7 h-7" />
        </div>

        <div>
          <h4 className="text-muted-foreground">{label}</h4>

          <span className="font-medium">
            {value}{' '}
            {total && `/${total} (${((value / total) * 100).toFixed(0)}%)`}
          </span>
        </div>
      </div>

      {total && (
        <div className="w-full h-2  bg-stone-200">
          <div
            className="h-full "
            style={{
              width: `${(value / total) * 100}%`,
              backgroundColor: interpolate(
                [0, 1],
                ['#f00', '#06ae06']
              )(value / total)
            }}
          />
        </div>
      )}
    </div>
  </div>
);

function CampaignItemDetails({
  campaign,
  $details
}: {
  campaign: Prisma.CampaignGetPayload<{
    include: { list: { include: { contacts: true } } };
  }>;
  $details: Promise<
    [
      Pick<Outbox, 'id' | 'status' | 'metadata' | 'email' | 'campaignId'>[],
      Pick<Queue, 'id' | 'status' | 'payload' | 'correlationId'>[]
    ]
  >;
}) {
  // const outboxes = use($outboxes);
  // const queues = use($queues);

  const [outboxes, queues] = use($details);

  return (
    <div className="flex flex-col gap-1">
      {campaign.list.contacts.map(contact => {
        const outbox = outboxes.find(
          outbox =>
            outbox.email === contact.email && outbox.campaignId === campaign.id
        );

        const queue = queues.find(
          q =>
            // @ts-ignore
            q.payload?.contact?.email === contact.email &&
            q.correlationId === campaign.id
        );

        return (
          <div
            key={contact.id}
            className="flex items-center gap-4 border rounded-md p-2"
          >
            <Badge
              // @ts-ignore
              variant={
                { pending: 'outline', completed: 'success' }?.[
                  queue?.status ?? 'pending'
                ] ?? 'pending'
              }
            >
              {queue?.status}
            </Badge>

            <Link href={`/user/${contact.id}/outbox/${outbox?.id}`}>
              {contact.email}
            </Link>

            <div className="flex gap-2 items-center">
              {outbox?.status === 'opened' && (
                <Badge variant="secondary">{outbox?.status}</Badge>
              )}
              {/* @ts-ignore */}
              {outbox?.metadata?.events?.some(
                // @ts-ignore
                event => event.type === 'click'
              ) && <Badge variant="default">clicked</Badge>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const CampaignItem = ({
  campaign,
  $details
}: {
  campaign: Prisma.CampaignGetPayload<{
    include: {
      list: { include: { contacts: true } };
      email: true;
      outboxes: true;
    };
  }>;
  $details: Promise<
    [
      Pick<Outbox, 'id' | 'status' | 'metadata' | 'email' | 'campaignId'>[],
      Pick<Queue, 'id' | 'status' | 'payload' | 'correlationId'>[]
    ]
  >;
}) => {
  const [open, setOpen] = useState(false);

  const [stateToggle, actionToggle, loadingToggle] = useActionState(
    toggleCampaign,
    campaign.active
  );

  const [, actionDelete, loadingDelete] = useActionState(deleteCampaign, false);

  return (
    <div
      className={cn('flex flex-col gap-4 border p-4 rounded-md', {
        'border-red-600 bg-red-100 animate-bounce opacity-20': loadingDelete
      })}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={() => setOpen(!open)}>
            {open ? <LuChevronUp /> : <LuChevronDown />}
          </Button>
        </div>
        <div className="aspect-square w-15 border rounded-md p-4 flex items-center justify-center">
          {campaign.list.contacts.length}
        </div>

        <div className="flex-1">
          <div className="font-medium">{campaign.title}</div>
          <div className="text-muted-foreground">{campaign.description}</div>
        </div>

        <div className="flex gap-4 items-center">
          <Stat
            label="Envoyé"
            total={campaign.list.contacts.length}
            value={campaign.outboxes.length}
            Icon={LuUser}
          />

          <Stat
            label="Ouverture"
            total={campaign.list.contacts.length}
            value={
              campaign.outboxes.filter(({ metadata }) =>
                // @ts-expect-error
                metadata?.events?.find(e => e.type === 'open')
              ).length
            }
            Icon={LuExternalLink}
          />

          <Stat
            label="Clicks"
            total={
              campaign.outboxes.filter(({ metadata }) =>
                // @ts-expect-error
                metadata?.events?.find(e => e.type === 'open')
              ).length
            }
            value={
              campaign.outboxes.filter(({ metadata }) =>
                // @ts-expect-error
                metadata?.events?.find(e => e.type === 'click')
              ).length
            }
            Icon={LuPointer}
          />
        </div>

        <div className="flex gap-2 items-center">
          <ModalButton label={<LuPencil />}>
            <CampaignsMutateModal campaign={campaign} />
          </ModalButton>

          <form action={actionToggle}>
            <input type="hidden" name="id" value={campaign.id} />

            <input
              type="hidden"
              name="active"
              value={(!campaign.active).toString()}
            />

            <Button
              type="submit"
              className={cn({
                'bg-green-600 hover:bg-green-700': campaign.active === false,
                'bg-yellow-600 hover:bg-yellow-700': campaign.active === true
              })}
            >
              {loadingToggle ? (
                <LucideLoader2 className="animate-spin" />
              ) : (
                <>{stateToggle === true ? <LuPause /> : <LuPlay />}</>
              )}
            </Button>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <LuEllipsisVertical />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem disabled asChild>
                <button type="submit" className="w-full">
                  <LuPencil />
                  Edit
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem disabled asChild>
                <button type="submit" className="w-full">
                  <LuCopy />
                  Duplicate
                </button>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <form action={actionDelete}>
                <input type="hidden" name="id" value={campaign.id} />

                <DropdownMenuItem variant="destructive" asChild>
                  <button type="submit" className="w-full">
                    {loadingDelete ? (
                      <LucideLoader2 className="animate-spin" />
                    ) : (
                      <LuTrash />
                    )}
                    Delete
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {open && (
        <Suspense
          fallback={
            <div>
              <LuLoader className="animate-spin" />
            </div>
          }
        >
          <CampaignItemDetails {...{ campaign, $details }} />
        </Suspense>
      )}
    </div>
  );
};
