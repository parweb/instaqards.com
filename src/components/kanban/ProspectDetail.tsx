'use client';

import { Prisma, User } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { atom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash-es';
import { Suspense } from 'react';
import { z } from 'zod';

import {
  LuBuilding2,
  LuCalendar,
  LuHandshake,
  LuHistory,
  LuMail,
  LuMapPin,
  LuMessagesSquare,
  LuPencil,
  LuPhone,
  LuSend,
  LuTrash,
  LuVideo
} from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import ProspectCommentModal from 'components/modal/comment-prospect';
import OutboxCreateModal from 'components/modal/create-outbox';
import ProspectReservationModal from 'components/modal/reservation-prospect';
import ProspectUnassignModal from 'components/modal/unassign-prospect';
import UserUpdateModal from 'components/modal/update-user';
import { Badge } from 'components/ui/badge';
import { formatPhoneNumber } from 'helpers/formatPhoneNumber';
import { UserKanban } from 'services/lead/type';
import { EventSchema, UserSchema } from '../../../prisma/generated/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from 'components/ui/card';

const EventsSchema = z.array(
  EventSchema.merge(
    z.object({
      user: UserSchema.pick({
        id: true,
        name: true,
        email: true,
        image: true
      }).merge(
        z.object({
          id: z.string()
        })
      )
    })
  )
);

const $events = atomFamily(
  (params: Prisma.EventFindManyArgs) =>
    atom(() =>
      fetch('/api/lake/event/findMany', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(data => EventsSchema.parse(data))
    ),
  isEqual
);

const History = ({ id }: { id: User['id'] }) => {
  const history = useAtomValue(
    $events({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })
  );

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      <div className="mb-4 flex items-center gap-2">
        <LuHistory className="text-muted-foreground h-4 w-4" />
        <h3 className="font-medium">Historique des événements</h3>
      </div>

      <div className="before:bg-border relative space-y-4 before:absolute before:top-0 before:bottom-0 before:left-2 before:w-px">
        {history.map(entry => (
          <div key={entry.id} className="relative pl-8">
            <div className="bg-foreground absolute top-[9px] left-[7px] h-1.5 w-1.5 -translate-x-1/2 rounded-full"></div>

            <div className="flex flex-col gap-1 rounded-md border border-stone-200/80 bg-stone-50 p-2 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-normal">
                    {entry.eventType}
                  </Badge>
                  {/* {entry.status && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {entry.status}
                    </Badge>
                  )} */}
                </div>

                <time className="text-muted-foreground ml-2 flex-shrink-0 text-xs">
                  {formatDistanceToNow(new Date(entry.createdAt), {
                    addSuffix: true,
                    locale: fr
                  })}
                </time>
              </div>

              {entry.payload && (
                <pre className="text-muted-foreground mt-1 overflow-x-auto rounded bg-gray-100 p-2 text-xs">
                  {JSON.stringify(entry.payload, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProspectDetail = ({
  id,
  company,
  address,
  postcode,
  city,
  phone,
  codeNaf,
  activity,
  email
}: UserKanban) => {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <LuBuilding2 className="h-6 w-6" />
            {company || 'Sans nom'}
          </CardTitle>

          <div className="flex items-center gap-2">
            <ModalButton
              size="sm"
              className="flex items-center gap-2"
              variant="destructive"
              label={
                <>
                  <LuTrash />
                  <span>Remove</span>
                </>
              }
            >
              <ProspectUnassignModal user={{ id }} />
            </ModalButton>

            <ModalButton
              size="sm"
              className="flex items-center gap-2"
              variant="outline"
              label={
                <>
                  <LuPencil />
                  <span>Edit</span>
                </>
              }
            >
              <UserUpdateModal user={{ id, name: company, email }} />
            </ModalButton>
          </div>
        </div>

        {activity && (
          <CardDescription className="text-sm">
            {activity}
            {codeNaf && (
              <span className="text-muted-foreground ml-2 text-xs">
                ({codeNaf})
              </span>
            )}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {email && (
            <div className="flex items-center gap-2 text-sm">
              <LuMail className="text-muted-foreground h-4 w-4" />
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </div>
          )}

          {phone && (
            <div className="flex items-center gap-2 text-sm">
              <LuPhone className="text-muted-foreground h-4 w-4" />
              <a
                href={`phone:${formatPhoneNumber(phone).replace(/\s/g, '')}`}
                className="hover:underline"
              >
                {formatPhoneNumber(phone)}
              </a>
            </div>
          )}
        </div>

        {(address || city || postcode) && (
          <div className="flex items-start gap-2 border-t pt-2 text-sm">
            <LuMapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
            <div className="space-y-1">
              {address && <div>{address}</div>}
              {(city || postcode) && (
                <div>
                  {postcode && <span>{postcode}</span>}
                  {city && <span className="ml-1">{city}</span>}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <ModalButton
            className="flex items-center gap-2"
            label={
              <>
                <LuSend />
                <span>Send</span>
              </>
            }
          >
            <OutboxCreateModal user={{ id, name: company, email }} />
          </ModalButton>

          <ModalButton
            className="flex items-center gap-2"
            label={
              <>
                <LuPhone />
                <span>Call</span>
              </>
            }
          >
            <ProspectReservationModal
              user={{ id, email, name: company, phone }}
              type="PHONE"
            />
          </ModalButton>

          <ModalButton
            className="flex items-center gap-2"
            label={
              <>
                <LuCalendar />
                <span>Reminder</span>
              </>
            }
          >
            <ProspectReservationModal
              user={{ id, email, name: company, phone }}
              type="REMINDER"
            />
          </ModalButton>

          <ModalButton
            className="flex items-center gap-2"
            label={
              <>
                <LuVideo />
                <span>Visio</span>
              </>
            }
          >
            <ProspectReservationModal
              user={{ id, email, name: company, phone }}
              type="VISIO"
            />
          </ModalButton>

          <ModalButton
            className="flex items-center gap-2"
            label={
              <>
                <LuHandshake />
                <span>In person</span>
              </>
            }
          >
            <ProspectReservationModal
              user={{ id, email, name: company, phone }}
              type="PHYSIC"
            />
          </ModalButton>

          <ModalButton
            className="flex items-center gap-2"
            label={
              <>
                <LuMessagesSquare />
                <span>Comment</span>
              </>
            }
          >
            <ProspectCommentModal user={{ id }} />
          </ModalButton>
        </div>

        <div className="max-h-[250px] overflow-y-auto sm:max-h-96">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
              </div>
            }
          >
            <History id={id} />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProspectDetail;
