import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import CreateSiteButton from 'components/create-site-button';
import CreateSiteModal from 'components/modal/create-site';
import PlaceholderCard from 'components/placeholder-card';
import Sites from 'components/sites';
import { getSession } from 'lib/auth';
import { db } from 'helpers';
import { translate } from 'helpers/translate';

export default async function AllSites() {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const users =
    session?.user.role === 'ADMIN'
      ? await db.user.findMany({
          include: { sites: true },
          where: { id: { not: session.user.id }, sites: { some: {} } }
        })
      : [];

  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {translate('dashboard.sites.title')}
          </h1>

          <CreateSiteButton>
            <CreateSiteModal />
          </CreateSiteButton>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <Sites />
        </Suspense>

        {users.length > 0 && (
          <div className="flex flex-col gap-8">
            {users.map(user => (
              <div key={`SitesUser-${user.id}`} className="flex flex-col gap-4">
                <h2 className="font-cal text-2xl font-bold dark:text-white flex flex-col gap-2">
                  <span>{user.name}</span>
                  <small className="text-gray-500">{user.email}</small>
                </h2>

                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <PlaceholderCard key={i} />
                      ))}
                    </div>
                  }
                >
                  <Sites userId={user.id} />
                </Suspense>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
