import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import CreateSiteButton from 'components/create-site-button';
import CreateSiteModal from 'components/modal/create-site';
import Sites from 'components/sites';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';

export default async function AllSites() {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const users = ([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
    session?.user.role
  )
    ? await db.user.findMany({
        include: { sites: true },
        where: {
          id: { not: session.user.id },
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
                <h2 className="font-cal text-2xl font-bold dark:text-white flex flex-col">
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
