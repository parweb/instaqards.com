import { Prisma, SubscriptionStatus } from '@prisma/client';
import { eachDayOfInterval } from 'date-fns';

import ModalButton from 'components/modal-button';
import UserCreateModal from 'components/modal/create-user';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { NewUsersChart } from './new-users-chart';
import { UsersTable } from './users-table';

import 'array-grouping-polyfill';

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<{
    page: string;
    take: string;
    search: string | undefined;
    withSite: string;
    subscription: string;
  }>;
}) {
  const params = await searchParams;

  const page = parseInt(params.page) || 1;
  const take = parseInt(params.take) || 25;
  const search = params.search;
  const withSite = params.withSite === 'true';
  const subscription = params.subscription || 'all';

  const where: Prisma.UserWhereInput = {
    ...(subscription !== 'all' && {
      subscriptions: {
        some: {
          status: subscription as SubscriptionStatus
        }
      }
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }),
    ...(withSite && {
      sites: {
        some: {}
      }
    })
  };

  const [users, displayUsers] = await db.$transaction([
    db.user.findMany({
      select: { createdAt: true },
      where,
      orderBy: { createdAt: 'desc' }
    }),
    db.user.findMany({
      include: {
        sites: { orderBy: { createdAt: 'desc' } },
        subscriptions: {
          include: { price: { include: { product: true } } },
          orderBy: {
            ended_at: 'desc'
          }
        }
      },
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip: (page - 1) * take
    })
  ]);

  const userGroups = users.reduce(
    (acc, user) => {
      const key = user.createdAt.toDateString();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const chartdata = eachDayOfInterval({
    start: users.at(-1)?.createdAt ?? new Date(),
    end: new Date()
  }).map(date => ({
    date: date.toDateString(),
    Users: userGroups[date.toDateString()] || 0
  }));

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

        <NewUsersChart
          data={chartdata}
          total={users.length}
          dailyGrowth={
            (chartdata.at(-2)?.Users ?? 0) === 0
              ? 0
              : Number(
                  ((chartdata.at(-1)?.Users ?? 0) /
                    (chartdata.at(-2)?.Users ?? 0)) *
                    100
                )
          }
        />

        <UsersTable users={displayUsers} total={users.length} />
      </div>
    </div>
  );
}
