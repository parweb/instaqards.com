'use client';

import { Outbox, Prisma, Queue, User } from '@prisma/client';
import { interpolate } from 'motion';
import Link from 'next/link';
import { Suspense, use, useActionState, useState } from 'react';
import { IconType } from 'react-icons';
import { FaMagic } from 'react-icons/fa';

import {
  LuChevronDown,
  LuChevronUp,
  LuCopy,
  LuEllipsisVertical,
  LuExternalLink,
  LuEye,
  LuLoader,
  LuMousePointer,
  LuPause,
  LuPencil,
  LuPlay,
  LuPointer,
  LuTarget,
  LuTrash,
  LuUser,
  LuUsers
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
            {!!total &&
              total > 0 &&
              `/${total} (${((value / total) * 100).toFixed(0)}%)`}
          </span>
        </div>
      </div>

      {!!total && total > 0 && (
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

const ContactItem = ({
  user: user,
  status,
  outbox
}: {
  user: Pick<User, 'id' | 'email'>;
  status: string | undefined;
  outbox: Pick<Outbox, 'id' | 'status' | 'metadata'> | undefined;
}) => {
  return (
    <div
      key={user.id}
      className="flex items-center gap-4 border rounded-md p-2"
    >
      <Badge
        variant={
          (
            {
              pending: 'outline',
              completed: 'success'
            } as const
          )?.[status ?? 'pending']
        }
      >
        {status}
      </Badge>

      <Link href={`/user/${user.id}/outbox/${outbox?.id}`}>{user.email}</Link>

      <div className="flex gap-2 items-center">
        {outbox?.status === 'opened' && (
          <Badge variant="secondary">{outbox?.status}</Badge>
        )}

        {/* @ts-ignore */}
        {outbox?.metadata?.events?.some(
          // @ts-ignore
          event => event.type === 'click'
        ) && <Badge variant="default">clicked</Badge>}

        {/* @ts-ignore */}
        {outbox?.metadata?.events?.some(
          // @ts-ignore
          event => event.type === 'bounced'
        ) && <Badge variant="destructive">bounced</Badge>}
      </div>
    </div>
  );
};

function CampaignItemDetails({
  campaign,
  $details
}: {
  campaign: Prisma.CampaignGetPayload<{
    include: {
      outboxes: true;
      list: {
        include: {
          contacts: {
            select: {
              id: true;
              email: true;
            };
          };
        };
      };
    };
  }>;
  $details: Promise<
    [
      Pick<Outbox, 'id' | 'status' | 'metadata' | 'email' | 'campaignId'>[],
      Pick<Queue, 'id' | 'status' | 'payload' | 'correlationId'>[],
      Pick<User, 'id' | 'email'>[]
    ]
  >;
}) {
  const [outboxes, queues, users] = use($details);

  if (campaign.smart) {
    return (
      <div className="flex flex-col gap-1">
        {campaign.outboxes.map(outbox => {
          const user = users.find(user => user.email === outbox.email);

          if (!user) {
            return null;
          }

          return (
            <ContactItem
              key={`${campaign.id}-${user.id}`}
              user={user}
              status="completed"
              outbox={outbox}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {campaign.list?.contacts.map(contact => {
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
          <ContactItem
            key={`${campaign.id}-${contact.id}`}
            user={contact}
            status={queue?.status}
            outbox={outbox}
          />
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
      Pick<Queue, 'id' | 'status' | 'payload' | 'correlationId'>[],
      Pick<User, 'id' | 'email'>[]
    ]
  >;
}) => {
  const [open, setOpen] = useState(false);

  const [stateToggle, actionToggle, loadingToggle] = useActionState(
    toggleCampaign,
    campaign.active
  );

  const [, actionDelete, loadingDelete] = useActionState(deleteCampaign, false);

  const funnelData = [
    {
      id: 'sent',
      name: 'Envoyé',
      icon: <LuUsers />,
      value: campaign.outboxes.length,
      total: campaign.list?.contacts.length ?? 0,
      color: '#10b981'
    },
    {
      id: 'delivered',
      name: 'Délivré',
      icon: <LuTarget />,
      value: campaign.outboxes.filter(
        ({ metadata }) =>
          // @ts-expect-error
          metadata?.events?.find(e => e.type === 'bounced') === undefined
      ).length,
      total: campaign.outboxes.length,
      color: '#3b82f6'
    },
    {
      id: 'opened',
      name: 'Ouvert',
      icon: <LuEye />,
      value: campaign.outboxes.filter(({ metadata }) =>
        // @ts-expect-error
        metadata?.events?.find(e => e.type === 'open')
      ).length,
      total: campaign.outboxes.filter(
        ({ metadata }) =>
          // @ts-expect-error
          metadata?.events?.find(e => e.type === 'bounced') === undefined
      ).length,
      color: '#f59e0b'
    },
    {
      id: 'clicked',
      name: 'Cliqué',
      icon: <LuMousePointer />,
      value: campaign.outboxes.filter(({ metadata }) =>
        // @ts-expect-error
        metadata?.events?.find(e => e.type === 'click')
      ).length,
      total: campaign.outboxes.filter(({ metadata }) =>
        // @ts-expect-error
        metadata?.events?.find(e => e.type === 'open')
      ).length,
      color: '#8b5cf6'
    }
  ];

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
          {campaign.list?.contacts.length ?? (
            <span className="scale-200">∞</span>
          )}
        </div>

        <div className="flex-1">
          {campaign.smart && (
            <Badge
              className={cn(
                'w-auto inline-flex items-center gap-1 rounded-full bg-green-500 hover:bg-green-700 text-green-900',
                'text-white'
              )}
            >
              <FaMagic /> Smart
            </Badge>
          )}
          <div className="font-medium">{campaign.title}</div>
          <div className="text-muted-foreground">{campaign.description}</div>
        </div>

        {/* <div className="w-100">
          <FunnelHoverChart data={funnelData} variant="trend-indicator" />
        </div> */}

        {/* <div className="flex items-center">
          {funnelData.map((data, index) => {
            return <div style={{ width: `${70 * Math.pow(0.90, index)}px`, backgroundColor:data.color }} className="aspect-square text-white/80 flex items-center justify-center rounded-md">{data.value}</div>;
          })}
        </div> */}

        <div className="flex gap-4 items-center">
          <Stat
            label="Envoyé"
            total={campaign.list?.contacts.length}
            value={campaign.outboxes.length}
            Icon={LuUser}
          />

          <Stat
            label="Ouverture"
            total={
              campaign.outboxes.filter(
                ({ metadata }) =>
                  // @ts-expect-error
                  metadata?.events?.find(e => e.type === 'bounced') ===
                  undefined
              ).length
            }
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
                <LuLoader className="animate-spin" />
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
                      <LuLoader className="animate-spin" />
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
