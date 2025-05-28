import { UserRole } from '@prisma/client';
import { Suspense } from 'react';

import CreateSiteButton from 'components/create-site-button';
import CreateSiteModal from 'components/modal/create-site';
import Sites from 'components/sites';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getAuth } from 'lib/auth';

export default async function AllSites() {
  const auth = await getAuth();
  const users = ([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
    auth.role
  )
    ? await db.user.findMany({
        include: { sites: true },
        where: {
          id: { not: auth.id },
          sites: { some: {} },
          role: { not: UserRole.LEAD }
        }
      })
    : [];

  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {await translate('dashboard.sites.title')}
          </h1>

          <CreateSiteButton>
            <CreateSiteModal />
          </CreateSiteButton>
        </div>

        <Suspense fallback={null}>
          <Sites />
        </Suspense>

        {users.length > 0 && (
          <div className="flex flex-col gap-8">
            {users.map(user => (
              <div key={`SitesUser-${user.id}`} className="flex flex-col gap-4">
                <h2 className="font-cal flex flex-col text-2xl font-bold dark:text-white">
                  <span>{user.name}</span>
                  <small className="text-gray-500">{user.email}</small>
                </h2>

                <Suspense fallback={null}>
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
