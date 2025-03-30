import { eachDayOfInterval, format } from 'date-fns';

import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { NewUsersChart } from './new-users-chart';
import { UsersTable } from './users-table';

import 'array-grouping-polyfill';

export default async function UsersPage() {
  // Fetch all users for the table
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
    }
  });

  const splitByDate = users.groupBy(({ createdAt }) =>
    createdAt.toDateString()
  );

  const start = users.at(-1)?.createdAt ?? 0;
  const end = users.at(0)?.createdAt ?? 0;

  const chartdata = eachDayOfInterval({ start, end }).map(date => {
    const key = date.toDateString();

    const users = splitByDate?.[key] || [];

    return {
      date: key,
      Users: users.length
    };
  });

  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {await translate('dashboard.users.title')}
          </h1>
        </div>

        <NewUsersChart data={chartdata} total={users.length} dailyGrowth={0} />

        <UsersTable initialUsers={users} />
      </div>
    </div>
  );
}
