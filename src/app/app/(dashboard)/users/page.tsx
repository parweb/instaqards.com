import { eachDayOfInterval } from 'date-fns';

import ModalButton from 'components/modal-button';
import UserCreateModal from 'components/modal/create-user';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { NewUsersChart } from './new-users-chart';
import { UsersTable } from './users-table';

import 'array-grouping-polyfill';

export default async function UsersPage() {
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

        <NewUsersChart data={chartdata} total={users.length} dailyGrowth={0} />

        <UsersTable initialUsers={users} />
      </div>
    </div>
  );
}
