import { UserRole } from '@prisma/client';

import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getAuth } from 'lib/auth';
import { CreateButton } from './CreateButton';
import { LinkCard } from './LinkCard';
import { MutateModal } from './MutateModal';

export default async function AllLinks() {
  const auth = await getAuth();

  const links = await db.link.findMany({
    select: {
      id: true,
      url: true,
      name: true,
      description: true,
      _count: {
        select: { clicks: true }
      }
    },
    where: { userId: auth.id }
  });

  const users = ([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
    auth.role
  )
    ? await db.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          links: {
            select: {
              id: true,
              url: true,
              name: true,
              description: true,
              _count: {
                select: { clicks: true }
              }
            }
          }
        },
        where: { id: { not: auth.id }, links: { some: {} } }
      })
    : [];

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col">
        <hgroup className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold">
            {await translate('dashboard.links.title')}
          </h1>

          <CreateButton label={await translate('dashboard.links.create')}>
            <MutateModal link={null} />
          </CreateButton>
        </hgroup>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {links.map(link => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>

      {users.length > 0 && (
        <div className="flex flex-col gap-8">
          {users.map(user => (
            <div key={`LinksUser-${user.id}`} className="flex flex-col gap-4">
              <h2 className="font-cal flex flex-col gap-2 text-2xl font-bold dark:text-white">
                <span>{user.name}</span>
                <small className="text-gray-500">{user.email}</small>
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {user.links.map(link => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
