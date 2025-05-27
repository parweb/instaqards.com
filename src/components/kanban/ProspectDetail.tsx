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
    <div className="pt-4 border-t">
      <div className="flex items-center gap-2 mb-4">
        <LuHistory className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-medium">Historique des événements</h3>
      </div>

      <div className="relative space-y-4 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-border">
        {history.map(entry => (
          <div key={entry.id} className="relative pl-8">
            <div className="absolute left-[7px] top-[9px] w-1.5 h-1.5 rounded-full bg-foreground -translate-x-1/2"></div>

            <div className="flex flex-col gap-1 p-2 bg-stone-50 border border-stone-200/80 shadow rounded-md">
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

                <time className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {formatDistanceToNow(new Date(entry.createdAt), {
                    addSuffix: true,
                    locale: fr
                  })}
                </time>
              </div>

              {entry.payload && (
                <pre className="text-xs text-muted-foreground mt-1 bg-gray-100 rounded p-2 overflow-x-auto">
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
}: User) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-2xl flex items-center gap-2">
            <LuBuilding2 className="w-6 h-6" />
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
              <span className="text-xs ml-2 text-muted-foreground">
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
              <LuMail className="w-4 h-4 text-muted-foreground" />
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </div>
          )}

          {phone && (
            <div className="flex items-center gap-2 text-sm">
              <LuPhone className="w-4 h-4 text-muted-foreground" />
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
          <div className="flex items-start gap-2 text-sm pt-2 border-t">
            <LuMapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
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

        <div className="max-h-[250px] sm:max-h-96 overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
