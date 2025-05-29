'use client';

import { Prisma } from '@prisma/client';
import { interpolate } from 'motion';
import Link from 'next/link';
import { Suspense, use, useActionState, useState } from 'react';
import { IconType } from 'react-icons';
import { FaMagic } from 'react-icons/fa';

import {
  LuActivity,
  LuCalendar,
  LuChevronDown,
  LuChevronUp,
  LuCopy,
  LuEllipsisVertical,
  LuExternalLink,
  LuGlobe,
  LuHandshake,
  LuLoader,
  LuMail,
  LuPause,
  LuPencil,
  LuPhone,
  LuPlay,
  LuPointer,
  LuTrash,
  LuUser,
  LuVideo
} from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import CampaignsMutateModal from 'components/modal/mutate-campaign';
import ProspectReservationModal from 'components/modal/reservation-prospect';
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
  <div className="rounded-md border shadow-sm">
    <div className="overflow-hidden rounded-md">
      <div className="flex items-center gap-4 px-4 py-2">
        <div className="flex items-center justify-center rounded-full bg-stone-100 p-4">
          <Icon className="h-7 w-7" />
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
        <div className="h-2 w-full bg-stone-200">
          <div
            className="h-full"
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
  outbox,
  phoneReservations
}: {
  user: Prisma.UserGetPayload<{
    select: {
      id: true;
      email: true;
      phone: true;
    };
  }>;
  status: string | undefined;
  outbox:
    | Prisma.OutboxGetPayload<{
        select: {
          id: true;
          status: true;
          metadata: true;
        };
      }>
    | undefined;
  phoneReservations?: Prisma.ReservationGetPayload<{
    select: {
      id: true;
      type: true;
      email: true;
      dateStart: true;
      dateEnd: true;
      comment: true;
      createdAt: true;
    };
  }>[];
}) => {
  return (
    <div
      key={user.id}
      className="flex items-center gap-4 rounded-md border p-3"
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

      <div className="flex-1">
        <div className="font-medium">
          <Link href={`/user/${user.id}`}>{user.email}</Link>
        </div>

        <div className="mt-1 flex items-center gap-2">
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

          {/* Affichage des réservations téléphoniques */}
          {phoneReservations && phoneReservations.length > 0 && (
            <Badge
              variant="default"
              className="border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
            >
              <LuPhone className="mr-1 h-3 w-3 text-white" />
              {phoneReservations.length === 1
                ? `Appel ${new Date(phoneReservations[0].dateStart).toLocaleDateString('fr-FR')}`
                : `${phoneReservations.length} appels`}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Lien vers la outbox */}
        {outbox && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/user/${user.id}/outbox/${outbox.id}`}>
              <LuMail className="h-4 w-4" />
            </Link>
          </Button>
        )}

        {/* Lien vers la fiche détail user */}
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/user/${user.id}`}>
            <LuUser className="h-4 w-4" />
          </Link>
        </Button>

        {/* Bouton téléphone */}
        <ModalButton
          variant={
            phoneReservations && phoneReservations.length > 0
              ? 'default'
              : 'ghost'
          }
          size="sm"
          className={cn({
            'border-green-500 bg-green-500 text-white hover:bg-green-600':
              phoneReservations && phoneReservations.length > 0
          })}
          label={
            <LuPhone
              className={cn(
                'h-4 w-4',
                phoneReservations && phoneReservations.length > 0
                  ? 'text-white'
                  : ''
              )}
            />
          }
        >
          <ProspectReservationModal
            user={{
              id: user.id,
              email: user.email,
              name: user.email,
              phone: user.phone
            }}
            type="PHONE"
          />
        </ModalButton>

        {/* Menu déroulant pour les rendez-vous */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <LuCalendar className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <ModalButton
                variant="ghost"
                className="w-full justify-start"
                label={
                  <>
                    <LuVideo className="mr-2 h-4 w-4" />
                    Visio
                  </>
                }
              >
                <ProspectReservationModal
                  user={{
                    id: user.id,
                    email: user.email,
                    name: user.email,
                    phone: user.phone
                  }}
                  type="VISIO"
                />
              </ModalButton>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ModalButton
                variant="ghost"
                className="w-full justify-start"
                label={
                  <>
                    <LuHandshake className="mr-2 h-4 w-4" />
                    En personne
                  </>
                }
              >
                <ProspectReservationModal
                  user={{
                    id: user.id,
                    email: user.email,
                    name: user.email,
                    phone: user.phone
                  }}
                  type="PHYSIC"
                />
              </ModalButton>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ModalButton
                variant="ghost"
                className="w-full justify-start"
                label={
                  <>
                    <LuCalendar className="mr-2 h-4 w-4" />
                    Rappel
                  </>
                }
              >
                <ProspectReservationModal
                  user={{
                    id: user.id,
                    email: user.email,
                    name: user.email,
                    phone: user.phone
                  }}
                  type="REMINDER"
                />
              </ModalButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Lien vers Recent Activity */}
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/user/${user.id}#recent-activity`}>
            <LuActivity className="h-4 w-4" />
          </Link>
        </Button>

        {/* Lien vers Pages visitées */}
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/user/${user.id}#pages-visited`}>
            <LuGlobe className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Fonction utilitaire pour déterminer les statuts d'un contact
const getContactStatuses = (
  outbox:
    | Prisma.OutboxGetPayload<{
        select: {
          id: true;
          status: true;
          metadata: true;
        };
      }>
    | undefined,
  status: string | undefined,
  phoneReservations?: Prisma.ReservationGetPayload<{
    select: {
      id: true;
      type: true;
      email: true;
      dateStart: true;
      dateEnd: true;
      comment: true;
      createdAt: true;
    };
  }>[]
) => {
  const statuses: string[] = [];

  if (status === 'completed' || outbox) {
    statuses.push('completed');
  }

  if (outbox?.metadata) {
    // @ts-ignore
    const events = outbox.metadata.events || [];

    // @ts-ignore
    if (events.some(event => event.type === 'bounced')) {
      statuses.push('bounced');
    }

    // @ts-ignore
    if (events.some(event => event.type === 'open')) {
      statuses.push('opened');
    }

    // @ts-ignore
    if (events.some(event => event.type === 'click')) {
      statuses.push('clicked');
    }
  }

  // Ajouter le statut "called" si il y a des réservations téléphoniques
  if (phoneReservations && phoneReservations.length > 0) {
    statuses.push('called');
  }

  return statuses;
};

function CampaignItemDetails({
  campaign,
  $details
}: {
  campaign: Prisma.CampaignGetPayload<{
    select: {
      id: true;
      smart: true;
      outboxes: {
        select: {
          email: true;
        };
      };
      list: {
        select: {
          contacts: {
            select: {
              id: true;
              email: true;
              phone: true;
            };
          };
        };
      };
    };
  }>;
  $details: Promise<
    [
      Prisma.OutboxGetPayload<{
        select: {
          id: true;
          status: true;
          metadata: true;
          email: true;
          campaignId: true;
        };
      }>[],

      Prisma.QueueGetPayload<{
        select: {
          id: true;
          status: true;
          payload: true;
          correlationId: true;
        };
      }>[],

      Prisma.UserGetPayload<{
        select: {
          id: true;
          email: true;
          phone: true;
        };
      }>[],

      Prisma.ReservationGetPayload<{
        select: {
          id: true;
          type: true;
          email: true;
          dateStart: true;
          dateEnd: true;
          comment: true;
          createdAt: true;
        };
      }>[]
    ]
  >;
}) {
  const [outboxes, queues, users, phoneReservations] = use($details);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Fonction pour basculer un filtre
  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  // Fonction pour filtrer les contacts
  const filterContacts = (contacts: any[]) => {
    if (selectedFilters.length === 0) {
      return contacts;
    }

    return contacts.filter(contact => {
      const contactStatuses = getContactStatuses(
        contact.outbox,
        contact.status,
        getPhoneReservationsForUser(contact.user.email)
      );
      return selectedFilters.some(filter => contactStatuses.includes(filter));
    });
  };

  // Fonction pour récupérer les réservations téléphoniques d'un utilisateur
  const getPhoneReservationsForUser = (email: string) => {
    return phoneReservations.filter(reservation => reservation.email === email);
  };

  // Préparer les données pour les filtres
  const filterOptions = [
    { key: 'completed', label: 'Completed', variant: 'success' as const },
    { key: 'bounced', label: 'Bounced', variant: 'destructive' as const },
    { key: 'opened', label: 'Opened', variant: 'secondary' as const },
    { key: 'clicked', label: 'Clicked', variant: 'default' as const },
    { key: 'called', label: 'Appelé', variant: 'outline' as const }
  ];

  if (campaign.smart) {
    const smartContacts = campaign.outboxes
      .map(outbox => {
        const user = users.find(user => user.email === outbox.email);
        if (!user) return null;

        return {
          key: `${campaign.id}-${user.id}`,
          user,
          status: 'completed',
          outbox
        };
      })
      .filter(Boolean);

    const filteredContacts = filterContacts(smartContacts);

    return (
      <div className="flex flex-col gap-4">
        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm">Filtrer par:</span>
          {filterOptions.map(option => (
            <Badge
              key={option.key}
              variant={
                selectedFilters.includes(option.key)
                  ? option.variant
                  : 'outline'
              }
              className={cn(
                'cursor-pointer transition-all',
                selectedFilters.includes(option.key) && 'ring-2 ring-offset-1'
              )}
              onClick={() => toggleFilter(option.key)}
            >
              {option.label}
            </Badge>
          ))}
          {selectedFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFilters([])}
              className="text-xs"
            >
              Effacer
            </Button>
          )}
        </div>

        {/* Liste des contacts */}
        <div className="flex flex-col gap-1">
          {filteredContacts.map(contact => (
            <ContactItem
              key={contact.key}
              user={contact.user}
              status={contact.status}
              outbox={contact.outbox}
              phoneReservations={getPhoneReservationsForUser(
                contact.user.email
              )}
            />
          ))}
          {filteredContacts.length === 0 && selectedFilters.length > 0 && (
            <div className="text-muted-foreground py-4 text-center">
              Aucun contact ne correspond aux filtres sélectionnés
            </div>
          )}
        </div>
      </div>
    );
  }

  const regularContacts =
    campaign.list?.contacts.map(contact => {
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

      return {
        key: `${campaign.id}-${contact.id}`,
        user: contact,
        status: queue?.status,
        outbox
      };
    }) || [];

  const filteredContacts = filterContacts(regularContacts);

  return (
    <div className="flex flex-col gap-4">
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Filtrer par:</span>
        {filterOptions.map(option => (
          <Badge
            key={option.key}
            variant={
              selectedFilters.includes(option.key) ? option.variant : 'outline'
            }
            className={cn(
              'cursor-pointer transition-all',
              selectedFilters.includes(option.key) && 'ring-2 ring-offset-1'
            )}
            onClick={() => toggleFilter(option.key)}
          >
            {option.label}
          </Badge>
        ))}
        {selectedFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFilters([])}
            className="text-xs"
          >
            Effacer
          </Button>
        )}
      </div>

      {/* Liste des contacts */}
      <div className="flex flex-col gap-1">
        {filteredContacts.map(contact => (
          <ContactItem
            key={contact.key}
            user={contact.user}
            status={contact.status}
            outbox={contact.outbox}
            phoneReservations={getPhoneReservationsForUser(contact.user.email)}
          />
        ))}
        {filteredContacts.length === 0 && selectedFilters.length > 0 && (
          <div className="text-muted-foreground py-4 text-center">
            Aucun contact ne correspond aux filtres sélectionnés
          </div>
        )}
      </div>
    </div>
  );
}

export const CampaignItem = ({
  campaign,
  $details
}: {
  campaign: Prisma.CampaignGetPayload<{
    select: {
      id: true;
      active: true;
      smart: true;
      title: true;
      description: true;
      type: true;
      list: {
        select: {
          id: true;
          contacts: {
            select: {
              id: true;
              email: true;
              phone: true;
            };
          };
        };
      };
      email: {
        select: {
          id: true;
        };
      };
      outboxes: {
        select: {
          email: true;
          metadata: true;
        };
      };
    };
  }>;
  $details: Promise<
    [
      Prisma.OutboxGetPayload<{
        select: {
          id: true;
          status: true;
          metadata: true;
          email: true;
          campaignId: true;
        };
      }>[],

      Prisma.QueueGetPayload<{
        select: {
          id: true;
          status: true;
          payload: true;
          correlationId: true;
        };
      }>[],

      Prisma.UserGetPayload<{
        select: {
          id: true;
          email: true;
          phone: true;
        };
      }>[],

      Prisma.ReservationGetPayload<{
        select: {
          id: true;
          type: true;
          email: true;
          dateStart: true;
          dateEnd: true;
          comment: true;
          createdAt: true;
        };
      }>[]
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
      className={cn('flex flex-col gap-4 rounded-md border p-4', {
        'animate-bounce border-red-600 bg-red-100 opacity-20': loadingDelete
      })}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={() => setOpen(!open)}>
            {open ? <LuChevronUp /> : <LuChevronDown />}
          </Button>
        </div>

        <div className="flex aspect-square w-15 items-center justify-center rounded-md border p-4">
          {campaign.list?.contacts.length ?? (
            <span className="scale-200">∞</span>
          )}
        </div>

        <div className="flex-1">
          {campaign.smart && (
            <Badge
              className={cn(
                'inline-flex w-auto items-center gap-1 rounded-full bg-green-500 text-green-900 hover:bg-green-700',
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

        <div className="flex items-center gap-4">
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

        <div className="flex items-center gap-2">
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
