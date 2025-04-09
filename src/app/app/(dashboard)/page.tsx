import { UserRole } from '@prisma/client';
import { eachDayOfInterval } from 'date-fns';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import OverviewSitesCTA from 'components/overview-sites-cta';
import OverviewStats from 'components/overview-stats';
import PlaceholderCard from 'components/placeholder-card';
import Sites from 'components/sites';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';

import 'array-grouping-polyfill';

export default async function Overview() {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const clicks =
    session.user.role === UserRole.ADMIN
      ? await db.click.findMany({ orderBy: { createdAt: 'asc' } })
      : await db.click.findMany({
          where: {
            OR: [
              { site: { user: { id: session.user.id } } },
              { block: { site: { user: { id: session.user.id } } } }
            ]
          },
          orderBy: { createdAt: 'asc' }
        });

  const splitByDate = clicks.groupBy(({ createdAt }) =>
    createdAt.toDateString()
  );

  const start = clicks.at(0)?.createdAt ?? 0;
  const end = clicks.at(-1)?.createdAt ?? 0;

  const chartdata = eachDayOfInterval({ start, end }).map(date => {
    const key = date.toDateString();

    return {
      date: key,
      Clicks:
        splitByDate?.[key]?.filter?.(({ siteId }) => siteId === null)?.length ??
        0,
      Visitors:
        splitByDate?.[key]?.filter?.(({ blockId }) => blockId === null)
          ?.length ?? 0
    };
  });

  const [yesterday = null, today = null] = chartdata.slice(-2);

  const pourcentVisitors =
    yesterday && today ? (today.Visitors / yesterday.Visitors - 1) * 100 : 0;

  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          {await translate('dashboard.home.title')}
        </h1>

        <OverviewStats
          dailyGrowth={pourcentVisitors}
          chartdata={chartdata}
          total={clicks.length}
        />
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {await translate('dashboard.home.top-sites')}
          </h1>

          <Suspense fallback={null}>
            <OverviewSitesCTA />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <PlaceholderCard key={index} />
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
