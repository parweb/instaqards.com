import { eachDayOfInterval, eachHourOfInterval } from 'date-fns';
import { redirect } from 'next/navigation';
import { LuArrowUpRight } from 'react-icons/lu';

import { NewUsersChart } from 'app/app/(dashboard)/users/new-users-chart';
import { UsersTable } from 'app/app/(dashboard)/users/users-table';
import Analytics from 'components/analytics';
import ModalButton from 'components/modal-button';
import UserCreateModal from 'components/modal/create-user';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';

import 'array-grouping-polyfill';
import Link from 'next/link';

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

  const users = await db.user.findMany({
    include: {
      sites: { orderBy: { createdAt: 'desc' } },
      subscriptions: {
        include: { price: { include: { product: true } } },
        orderBy: {
          ended_at: 'desc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      referer: { id: session.user.id }
    }
  });

  const chartUsers = eachDayOfInterval({
    start: users.at(-1)?.createdAt ?? 0,
    end: users.at(0)?.createdAt ?? 0
  }).map(date => {
    const key = date.toDateString();

    return {
      date: key,
      Users: (
        users.groupBy(({ createdAt }) => createdAt.toDateString())?.[key] || []
      ).length
    };
  });

  return (
    <div className="flex flex-col space-y-12 p-8">
      <hgroup className="flex items-center justify-between gap-2">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          All Affiliates
        </h1>

        <Link
          href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/?r=${session.user.id}`}
          target="_blank"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 flex items-center gap-2"
        >
          <span>{`${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/?r=${session.user.id}`}</span>
          <LuArrowUpRight />
        </Link>
      </hgroup>

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col gap-2">
          <hgroup className="flex items-center justify-between gap-2">
            <h1 className="font-cal text-3xl font-bold dark:text-white">
              {await translate('dashboard.users.title')}
            </h1>

            <ModalButton label={await translate('dashboard.users.create')}>
              <UserCreateModal />
            </ModalButton>
          </hgroup>
        </div>

        <NewUsersChart data={chartUsers} total={users.length} dailyGrowth={0} />

        <UsersTable affiliate initialUsers={users} />
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-center sm:justify-start">
          <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 flex-1 justify-between"></div>
        </div>

        <Analytics chartdata={chartdata} />
      </div>
    </div>
  );
}
