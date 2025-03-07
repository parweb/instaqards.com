import { eachHourOfInterval } from 'date-fns';
import { unstable_cache } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import Analytics from 'components/analytics';
import { db } from 'helpers';
import { getSession } from 'lib/auth';

import 'array-grouping-polyfill';

const getCachedClicks = unstable_cache(
  async (siteId: string) => {
    return db.click.findMany({
      where: {
        OR: [{ siteId }, { block: { siteId } }]
      },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true, siteId: true, blockId: true }
    });
  },
  ['site-clicks'],
  { revalidate: 3600 }
);

export default async function SiteAnalytics({
  params
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const site = await db.site.findUnique({
    where: { id: decodeURIComponent(params.id) }
  });

  if (
    !site ||
    (site.userId !== session?.user?.id && session.user.role !== 'ADMIN')
  ) {
    notFound();
  }

  const clicks = await getCachedClicks(site.id);

  const splitByDate = clicks.groupBy(({ createdAt }) => {
    const when = new Date(createdAt);
    when.setHours(when.getHours(), 0, 0, 0);
    return when.toISOString();
  });

  const start = clicks.at(0)?.createdAt ?? 0;
  const end = clicks.at(-1)?.createdAt ?? 0;

  const chartdata = eachHourOfInterval({ start, end }).map(date => {
    const when = new Date(date);
    when.setHours(when.getHours(), 0, 0, 0);
    const key = when.toISOString();

    const dateClicks = splitByDate?.[key] || [];

    const clicksCount = dateClicks.filter(
      ({ siteId }) => siteId === null
    ).length;

    const visitorsCount = dateClicks.filter(
      ({ blockId }) => blockId === null
    ).length;

    return {
      date: key,
      Clicks: clicksCount,
      Visitors: visitorsCount
    };
  });

  const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 flex-1 justify-between">
          <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
            Analytics for {site.name}
          </h1>

          <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${url}`
                : `http://${site.subdomain}.localhost:11000`
            }
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {process.env.NEXT_PUBLIC_VERCEL_ENV
              ? url
              : `${site.subdomain}.localhost:11000`}{' '}
            ↗
          </a>
        </div>
      </div>

      <Suspense fallback={<div>Chargement des analytics...</div>}>
        <Analytics chartdata={chartdata} />
      </Suspense>
    </>
  );
}
