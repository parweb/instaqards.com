import { eachMinuteOfInterval } from 'date-fns';
import { notFound, redirect } from 'next/navigation';

import Analytics from 'components/analytics';
import { db } from 'helpers';
import { getSession } from 'lib/auth';

import 'array-grouping-polyfill';

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
    where: {
      id: decodeURIComponent(params.id)
    }
  });

  if (!site || site.userId !== session.user.id) {
    notFound();
  }

  const clicks = await db.click.findMany({
    where: {
      OR: [{ siteId: site.id }, { link: { siteId: site.id } }]
    },
    orderBy: { createdAt: 'asc' }
  });

  const splitByDate = clicks.groupBy(({ createdAt }) =>
    [createdAt.toDateString(), createdAt.getHours() + 'h'].join(' ')
  );

  const start = clicks.at(0)?.createdAt ?? 0;
  const end = clicks.at(-1)?.createdAt ?? 0;

  const chartdata = eachMinuteOfInterval({ start, end }).map(date => {
    const key = [date.toDateString(), date.getHours() + 'h'].join(' ');

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

      <Analytics chartdata={chartdata} />
    </>
  );
}
