import { UserRole } from '@prisma/client';
import { notFound } from 'next/navigation';
import { LuArrowUpRight } from 'react-icons/lu';

import { Badge } from 'components/ui/badge';
import { db } from 'helpers/db';
import { getAuth } from 'lib/auth';
import { cn } from 'lib/utils';
import { uri } from 'settings';
import { Calendar } from './client';

import 'array-grouping-polyfill';

export default async function SiteReservations(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date: string }>;
}) {
  const query = await props.searchParams;
  const params = await props.params;
  const date = query.date ? new Date(query.date) : new Date();

  const [auth, site] = await Promise.all([
    getAuth(),
    db.site.findUnique({
      select: {
        id: true,
        name: true,
        userId: true,
        subdomain: true
      },
      where: { id: decodeURIComponent(params.id) }
    })
  ]);

  if (
    !site ||
    (site.userId !== auth.id &&
      !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(auth.role))
  ) {
    notFound();
  }

  const reservations = await db.reservation.findMany({
    select: {
      id: true,
      dateStart: true,
      dateEnd: true,
      name: true,
      email: true,
      comment: true,
      block: {
        select: {
          siteId: true,
          site: {
            select: {
              name: true
            }
          }
        }
      }
    },
    where: { block: { siteId: site.id } },
    orderBy: { dateStart: 'asc' }
  });

  const sites = reservations.groupBy(
    reservation => reservation?.block?.siteId ?? 'none'
  );

  return (
    <div className="flex flex-1 flex-col gap-6 self-stretch p-8">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <h1 className="font-cal text-xl font-bold sm:text-3xl">
          Reservations for {site.name}
        </h1>

        <a
          href={uri.site(site).link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
        >
          {uri.site(site).title} <LuArrowUpRight />
        </a>
      </div>

      <div className="flex flex-1 flex-col gap-4 self-stretch">
        <section className="flex flex-1 flex-col gap-4 self-stretch md:flex-row">
          <nav className="flex flex-col items-center gap-4 rounded-md border border-stone-200 p-4">
            <div>
              <Calendar reservations={reservations} value={date} />
            </div>

            <div className="flex flex-1 flex-col gap-2 self-stretch">
              {Object.entries(sites).map(([siteId, reservations]) => (
                <div
                  key={siteId}
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-md p-2',
                    'bg-stone-100'
                  )}
                >
                  <div>{reservations.at(0)?.block?.site?.name ?? ''}</div>

                  <div>
                    <Badge>{reservations.length}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </nav>

          <main className="flex flex-1 flex-col gap-4 self-stretch overflow-scroll rounded-md border border-stone-200 p-4">
            <div
              className={cn(
                'sticky top-0',
                'flex flex-col gap-0',
                'bg-primary rounded-md p-4'
              )}
            >
              <div className="text-lg font-bold text-white">
                {date.toLocaleDateString('fr-FR', {
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-white/70">
                {date.toLocaleDateString('fr-FR', {
                  weekday: 'long'
                })}
              </div>
            </div>

            {reservations
              .filter(
                reservation =>
                  reservation.dateStart.toDateString() === date?.toDateString()
              )
              .map(reservation => (
                <div
                  key={reservation.id}
                  className={cn('flex gap-8', 'rounded-md bg-stone-100 p-4')}
                >
                  <div className="flex aspect-square flex-col items-center justify-center rounded-md border border-stone-400 p-4">
                    <div className="text-xl font-bold">
                      {new Date(reservation.dateStart).toLocaleTimeString(
                        'fr-FR',
                        {
                          hour: '2-digit',
                          minute: '2-digit'
                        }
                      )}
                    </div>
                    {reservation.dateEnd && (
                      <div className="text-black/70">
                        {(new Date(reservation.dateEnd).getTime() -
                          new Date(reservation.dateStart).getTime()) /
                          60000}{' '}
                        min
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-lg font-bold">
                        {reservation.name}
                      </div>
                      <div className="text-black/70">{reservation.email}</div>
                    </div>
                    {reservation.comment && (
                      <div
                        className="rounded-md border border-stone-200 bg-slate-500 p-4 whitespace-pre-wrap text-white"
                        dangerouslySetInnerHTML={{
                          __html: reservation.comment
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
          </main>
        </section>
      </div>
    </div>
  );
}
