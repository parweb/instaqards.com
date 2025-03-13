import { eachHourOfInterval } from 'date-fns';
import { redirect } from 'next/navigation';

import Analytics from 'components/analytics';
import { db } from 'helpers/db';
import { getSession } from 'lib/auth';

import 'array-grouping-polyfill';

export default async function AllAffiliation() {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const affiliates = await db.user.findMany({
    where: {
      referer: { id: session.user.id }
    }
  });

  const splitByDate = affiliates.groupBy(({ createdAt }) => {
    const when = new Date(createdAt);
    when.setHours(when.getHours(), 0, 0, 0);
    return when.toISOString();
  });

  const start = affiliates.at(0)?.createdAt ?? 0;
  const end = affiliates.at(-1)?.createdAt ?? 0;

  const chartdata = eachHourOfInterval({ start, end }).map(date => {
    const when = new Date(date);
    when.setHours(when.getHours(), 0, 0, 0);
    const key = when.toISOString();

    return {
      date: key,
      Clicks: splitByDate?.[key]?.length ?? 0
    };
  });

  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-center sm:justify-start">
          <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 flex-1 justify-between">
            <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
              All Affiliates
            </h1>

            <a
              href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/?r=${session.user.id}`}
              target="_blank"
              rel="noreferrer"
              className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
            >
              {`${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/?r=${session.user.id}`}{' '}
              ↗
            </a>
          </div>
        </div>

        <Analytics chartdata={chartdata} />
      </div>
    </div>
  );
}
