import { notFound, redirect } from 'next/navigation';

import Analytics from '@/components/analytics';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import 'array-grouping-polyfill';
import { eachMinuteOfInterval } from 'date-fns';

export default async function SiteAnalytics({
  params
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const site = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id)
    }
  });

  if (!site || site.userId !== session.user.id) {
    notFound();
  }

  const clicks = await prisma.click.findMany({
    where: {
      OR: [{ siteId: site.id }, { link: { siteId: site.id } }]
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log({ clicks });

  const splitByDate = clicks.groupBy(({ createdAt }) =>
    [
      createdAt.toDateString(),
      [createdAt.getHours(), createdAt.getMinutes()].join(':')
    ].join(' ')
  );

  console.log({ splitByDate });

  // const visitors = Object.entries(
  //   site.clicks.groupBy(({ createdAt }) =>
  //     [
  //       createdAt.toDateString(),
  //       [createdAt.getHours(), createdAt.getMinutes()].join(':')
  //     ].join(' ')
  //   )
  // ).map(([date, links]) => ({
  //   date,
  //   Visitors: links.length
  // }));

  // const clicks = Object.entries(
  //   site.clicks.groupBy(({ createdAt }) =>
  //     [
  //       createdAt.toDateString(),
  //       [createdAt.getHours(), createdAt.getMinutes()].join(':')
  //     ].join(' ')
  //   )
  // ).map(([date, links]) => ({
  //   date,
  //   Visitors: links.length
  // }));

  const start = clicks.at(0)?.createdAt ?? 0;
  const end = clicks.at(-1)?.createdAt ?? 0;

  const chartdata = eachMinuteOfInterval({ start, end }).map(date => {
    const key = [
      date.toDateString(),
      [date.getHours(), date.getMinutes()].join(':')
    ].join(' ');

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

  //   const month = click.createdAt.getMonth() + 1; // JavaScript months are 0-indexed
  //   const year = click.createdAt.getFullYear();
  //   const monthYear = `${month < 10 ? '0' + month : month} ${year.toString().slice(-2)}`; // Format as 'MM YY'

  //   return {
  //     date: monthYear,
  //     Clicks: click._count.createdAt
  //   };
  // });

  console.log({ chartdata });

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
                : `http://${site.subdomain}.localhost:3000`
            }
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {process.env.NEXT_PUBLIC_VERCEL_ENV
              ? url
              : `${site.subdomain}.localhost:3000`}{' '}
            ↗
          </a>
        </div>
      </div>

      <Analytics chartdata={chartdata} />
    </>
  );
}
