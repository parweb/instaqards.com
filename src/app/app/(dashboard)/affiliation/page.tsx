import { Prisma, SubscriptionStatus, User, UserRole } from '@prisma/client';
import { eachDayOfInterval, format } from 'date-fns';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LuArrowUpRight } from 'react-icons/lu';

import { UsersTable } from 'app/app/(dashboard)/users/users-table';
import ProspectsKanbanWrapper from 'components/kanban/ProspectsKanbanWrapper';
import ModalButton from 'components/modal-button';
import UserCreateModal from 'components/modal/create-user';
import ProspectsImportModal from 'components/modal/prospects-import';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';
import * as lead from 'services/lead';
import { AffiliationChart } from './affiliation-chart';
import { parser } from './utils';
import { uri } from 'settings';

export default async function AllAffiliation({
  searchParams
}: {
  searchParams: Promise<{
    page: string;
    take: string;
    search: string | undefined;
    withSite: string;
    subscription: string;
    range: string;
  }>;
}) {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const params = await searchParams;

  const range = parser.parse(params.range);

  const page = parseInt(params.page) || 1;
  const take = parseInt(params.take) || 25;
  const search = params.search;
  const withSite = params.withSite === 'true';
  const subscription = params.subscription || 'all';

  const isSeller = [UserRole.SELLER, UserRole.ADMIN].includes(
    // @ts-ignore
    session.user.role
  );

  const where: Prisma.UserWhereInput = {
    refererId: session.user.id,
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
    }),
    ...(range && {
      createdAt: {
        gte: range.from,
        lte: range.to
      }
    })
  };

  const [
    totalUsersInRange,
    allUserCreations,
    allUserClicks,
    allUserSubscriptions,
    displayUsers
  ] = await db.$transaction([
    db.user.count({ where }),
    db.user.findMany({
      where,
      select: { createdAt: true }
    }),
    db.click.findMany({
      where: {
        refererId: session.user.id,
        createdAt: { gte: range?.from, lte: range?.to }
      },
      select: { createdAt: true }
    }),
    db.subscription.findMany({
      select: {
        created: true,
        price: { select: { unit_amount: true } },
        quantity: true
      },
      where: {
        user: { refererId: session.user.id },
        created: { gte: range?.from, lte: range?.to }
      }
    }),
    db.user.findMany({
      include: {
        sites: { orderBy: { createdAt: 'desc' } },
        subscriptions: {
          include: { price: { include: { product: true } } },
          orderBy: { ended_at: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * take,
      where,
      take
    })
  ]);

  const [prospectsNew, prospectsInProgress, prospectsWin, prospectsLost] =
    isSeller
      ? await Promise.all([
          lead.all('NEW'),
          lead.all('IN_PROGRESS'),
          lead.all('WIN'),
          lead.all('LOST')
        ])
      : [[], [], [], []];

  const dailyUsersMap: Record<string, number> = {};
  allUserCreations.forEach(u => {
    const dateStr = format(u.createdAt, 'MMM d');
    dailyUsersMap[dateStr] = (dailyUsersMap[dateStr] || 0) + 1;
  });

  const dailyClicksMap: Record<string, number> = {};
  allUserClicks.forEach(click => {
    const dateStr = format(click.createdAt, 'MMM d');
    dailyClicksMap[dateStr] = (dailyClicksMap[dateStr] || 0) + 1;
  });

  const dailySubscriptionsMap: Record<string, number> = {};
  allUserSubscriptions.forEach(sub => {
    const dateStr = format(sub.created, 'MMM d');
    dailySubscriptionsMap[dateStr] =
      (dailySubscriptionsMap[dateStr] || 0) +
      ((sub.price.unit_amount || 0) / 100) *
        sub.quantity *
        session.user.affiliateRate;
  });

  const earliestDateOverall =
    allUserCreations.length > 0
      ? allUserCreations[allUserCreations.length - 1].createdAt
      : allUserClicks.length > 0
        ? allUserClicks[allUserClicks.length - 1].createdAt
        : allUserSubscriptions.length > 0
          ? allUserSubscriptions[allUserSubscriptions.length - 1].created
          : new Date();
  const defaultStartDate = new Date();
  if (
    allUserCreations.length === 0 &&
    allUserClicks.length === 0 &&
    allUserSubscriptions.length === 0
  ) {
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
  }

  const intervalStart = range?.from ?? earliestDateOverall ?? defaultStartDate;
  const intervalEnd = range?.to ?? new Date();

  const chartUsers = eachDayOfInterval({
    start: intervalStart,
    end: intervalEnd
  }).map(date => ({
    date: format(date, 'MMM d'),
    Users: dailyUsersMap[format(date, 'MMM d')] || 0,
    Clicks: dailyClicksMap[format(date, 'MMM d')] || 0,
    Subscriptions: dailySubscriptionsMap[format(date, 'MMM d')] || 0
  }));

  const prospectsByStatus: Record<string, User[]> = {
    NEW: prospectsNew,
    IN_PROGRESS: prospectsInProgress,
    WIN: prospectsWin,
    LOST: prospectsLost
  };

  const statuses = ['NEW', 'IN_PROGRESS', 'WIN', 'LOST'];
  const statusLabels: Record<string, string> = {
    NEW: 'Nouveau',
    IN_PROGRESS: 'En cours',
    WIN: 'Gagné',
    LOST: 'Perdu'
  };

  return (
    <div className="flex flex-col space-y-12 p-8">
      <hgroup className="flex items-center justify-between gap-2">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          All Affiliates
        </h1>

        <Link
          href={uri.app(`/?r=${session.user.id}`)}
          target="_blank"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 flex items-center gap-2"
        >
          <span>{uri.app(`/?r=${session.user.id}`)}</span>
          <LuArrowUpRight />
        </Link>
      </hgroup>

      <div className="flex flex-col space-y-6">
        {isSeller && (
          <>
            <div className="flex flex-col gap-2">
              <hgroup className="flex items-center justify-between gap-2">
                <h1 className="font-cal text-3xl font-bold dark:text-white">
                  {await translate('dashboard.affiliation.title')}
                </h1>

                <div className="flex items-center gap-2">
                  <ModalButton
                    label={await translate(
                      'dashboard.affiliation.import.prospects'
                    )}
                  >
                    <ProspectsImportModal />
                  </ModalButton>

                  <ModalButton
                    label={await translate('dashboard.affiliation.create')}
                  >
                    <UserCreateModal role={UserRole.LEAD} />
                  </ModalButton>
                </div>
              </hgroup>
            </div>

            <ProspectsKanbanWrapper
              initialColumns={prospectsByStatus}
              statuses={statuses}
              statusLabels={statusLabels}
            />
          </>
        )}

        <AffiliationChart data={chartUsers} />

        <UsersTable affiliate users={displayUsers} total={totalUsersInRange} />
      </div>
    </div>
  );
}
