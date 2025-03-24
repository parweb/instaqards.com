import { redirect } from 'next/navigation';

import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';
import { CreateButton } from './CreateButton';
import { LinkCard } from './LinkCard';
import { MutateModal } from './MutateModal';

export default async function AllLinks() {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const links = await db.link.findMany({
    include: { clicks: true },
    where: { userId: session.user.id }
  });

  const users =
    session?.user.role === 'ADMIN'
      ? await db.user.findMany({
          include: { links: { include: { clicks: true } } },
          where: { id: { not: session.user.id }, links: { some: {} } }
        })
      : [];

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col">
        <hgroup className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold">
            {translate('dashboard.links.title')}
          </h1>

          <CreateButton label={translate('dashboard.links.create')}>
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
              <h2 className="font-cal text-2xl font-bold dark:text-white flex flex-col gap-2">
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
