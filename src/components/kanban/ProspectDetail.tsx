'use client';

import { Prisma, Prospect } from '@prisma/client';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { atom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash-es';
import { Suspense } from 'react';
import { z } from 'zod';

import {
  LuBuilding2,
  LuHistory,
  LuMail,
  LuMapPin,
  LuPhone
} from 'react-icons/lu';

import { Badge } from 'components/ui/badge';

import {
  ProspectStatusHistorySchema,
  UserSchema
} from '../../../prisma/generated/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from 'components/ui/card';
import { formatPhoneNumber } from 'helpers/formatPhoneNumber';

const ProspectStatusHistoriesSchema = z.array(
  ProspectStatusHistorySchema.merge(
    z.object({
      updatedByUser: UserSchema.pick({
        id: true,
        name: true,
        email: true,
        image: true
      })
    })
  )
);

const $prospectStatusHistory = atomFamily(
  (params: Prisma.ProspectStatusHistoryFindManyArgs) =>
    atom(() =>
      fetch('/api/lake/prospectStatusHistory/findMany', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(data => ProspectStatusHistoriesSchema.parse(data))
    ),
  isEqual
);

const History = ({ id }: { id: Prospect['id'] }) => {
  const history = useAtomValue(
    $prospectStatusHistory({
      where: { prospectId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        updatedByUser: {
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
        <h3 className="font-medium">Historique des statuts</h3>
      </div>

      <div className="relative space-y-4 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-border">
        {history.map(entry => (
          <div key={entry.id} className="relative pl-8">
            <div className="absolute left-[7px] top-[9px] w-1.5 h-1.5 rounded-full bg-foreground -translate-x-1/2"></div>

            <div className="flex flex-col gap-1 p-2 bg-stone-50 border border-stone-200/80 shadow rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-normal">
                    {entry.previousStatus}
                  </Badge>

                  <svg
                    className="w-4 h-4 text-muted-foreground flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M5 12h14m-7-7l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <Badge variant="outline" className="text-xs font-normal">
                    {entry.newStatus}
                  </Badge>
                </div>

                <time className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {formatDistanceToNow(new Date(entry.createdAt), {
                    addSuffix: true,
                    locale: fr
                  })}
                </time>
              </div>

              {entry.updatedByUser && (
                <p className="text-xs text-muted-foreground mt-1">
                  Modifié par {entry.updatedByUser.name}
                </p>
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
  raison_sociale,
  adresse,
  cp,
  ville,
  tel,
  code_naf,
  activite,
  email,
  status
}: Prospect) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <LuBuilding2 className="w-6 h-6" />
            {raison_sociale || 'Sans nom'}
          </CardTitle>
          <Badge
            variant={status === 'NEW' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {status}
          </Badge>
        </div>

        {activite && (
          <CardDescription className="text-sm">
            {activite}
            {code_naf && (
              <span className="text-xs ml-2 text-muted-foreground">
                ({code_naf})
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

          {tel && (
            <div className="flex items-center gap-2 text-sm">
              <LuPhone className="w-4 h-4 text-muted-foreground" />
              <a
                href={`tel:${formatPhoneNumber(tel).replace(/\s/g, '')}`}
                className="hover:underline"
              >
                {formatPhoneNumber(tel)}
              </a>
            </div>
          )}
        </div>

        {(adresse || ville || cp) && (
          <div className="flex items-start gap-2 text-sm pt-2 border-t">
            <LuMapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              {adresse && <div>{adresse}</div>}
              {(ville || cp) && (
                <div>
                  {cp && <span>{cp}</span>}
                  {ville && <span className="ml-1">{ville}</span>}
                </div>
              )}
            </div>
          </div>
        )}

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <History id={id} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default ProspectDetail;
