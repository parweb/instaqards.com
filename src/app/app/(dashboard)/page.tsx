import { eachMinuteOfInterval } from 'date-fns';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import OverviewSitesCTA from 'components/overview-sites-cta';
import OverviewStats from 'components/overview-stats';
import PlaceholderCard from 'components/placeholder-card';
import Sites from 'components/sites';
import { db } from 'helpers';
import { getSession } from 'lib/auth';

import 'array-grouping-polyfill';
import { UserRole } from '@prisma/client';

export default async function Overview() {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const clicks =
    session.user.role === UserRole.ADMIN
      ? await db.click.findMany({
          orderBy: { createdAt: 'asc' }
        })
      : await db.click.findMany({
          where: {
            OR: [
              { site: { user: { id: session.user.id } } },
              { link: { site: { user: { id: session.user.id } } } }
            ]
          },
          orderBy: { createdAt: 'asc' }
        });

  const splitByDate = clicks.groupBy(({ createdAt }) =>
    createdAt.toDateString()
  );

  const start = clicks.at(0)?.createdAt ?? 0;
  const end = clicks.at(-1)?.createdAt ?? 0;

  const chartdata = eachMinuteOfInterval({ start, end }).map(date => {
    const key = date.toDateString();

    return {
      date: key,
      Clicks:
        splitByDate?.[key]?.filter?.(({ siteId }) => siteId === null)?.length ??
        0,
      Visitors:
        splitByDate?.[key]?.filter?.(({ linkId }) => linkId === null)?.length ??
        0
    };
  });

  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Overview
        </h1>

        <OverviewStats chartdata={chartdata} total={clicks.length} />
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Top Sites
          </h1>
          <Suspense fallback={null}>
            <OverviewSitesCTA />
          </Suspense>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <Sites limit={4} />
        </Suspense>
      </div>
    </div>
  );
}
