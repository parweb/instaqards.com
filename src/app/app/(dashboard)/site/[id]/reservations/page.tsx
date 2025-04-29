import { UserRole } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import { LuArrowUpRight } from 'react-icons/lu';

import { Badge } from 'components/ui/badge';
import { db } from 'helpers/db';
import { getSession } from 'lib/auth';
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

  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const site = await db.site.findUnique({
    where: { id: decodeURIComponent(params.id) }
  });

  if (
    !site ||
    (site.userId !== session?.user?.id &&
      !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
        session?.user.role
      ))
  ) {
    notFound();
  }

  const reservations = await db.reservation.findMany({
    include: { block: { include: { site: true } } },
    where: { block: { siteId: site.id } },
    orderBy: { dateStart: 'asc' }
  });

  const sites = reservations.groupBy(
    reservation => reservation?.block?.siteId ?? 'none'
  );

  return (
    <div className="p-8 flex flex-col gap-6 flex-1 self-stretch">
      <div className="flex flex-col items-center sm:flex-row justify-between">
        <h1 className="font-cal text-xl font-bold sm:text-3xl">
          Reservations for {site.name}
        </h1>

        <a
          href={uri.site(site).link}
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 flex items-center gap-2"
        >
          {uri.site(site).title} <LuArrowUpRight />
        </a>
      </div>

      <div className="flex-1 self-stretch flex flex-col gap-4 ">
        <section className="flex-1 self-stretch flex gap-4 md:flex-row flex-col">
          <nav className="flex flex-col items-center border border-stone-200 rounded-md p-4 gap-4">
            <div>
              <Calendar reservations={reservations} value={date} />
            </div>

            <div className="flex-1 self-stretch flex flex-col gap-2">
              {Object.entries(sites).map(([siteId, reservations]) => (
                <div
                  key={siteId}
                  className={cn(
                    'flex items-center justify-between gap-2 p-2 rounded-md',
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

          <main className="flex-1 self-stretch flex flex-col border border-stone-200 rounded-md gap-4 p-4 overflow-scroll">
            <div
              className={cn(
                'sticky top-0',
                'flex flex-col gap-0',
                'rounded-md p-4 bg-primary'
              )}
            >
              <div className="font-bold text-lg text-white">
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
                  className={cn('flex gap-8', 'rounded-md p-4 bg-stone-100')}
                >
                  <div className="flex flex-col items-center justify-center aspect-square border border-stone-400 rounded-md p-4">
                    <div className="font-bold text-xl">
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
                      <div className="font-bold text-lg">
                        {reservation.name}
                      </div>
                      <div className="text-black/70">{reservation.email}</div>
                    </div>
                    {reservation.comment && (
                      <div
                        className="whitespace-pre-wrap p-4 rounded-md border border-stone-200 bg-slate-500 text-white"
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
