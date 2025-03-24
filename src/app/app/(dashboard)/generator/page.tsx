import { db } from 'helpers/db';
import { redirect } from 'next/navigation';

import { WebSite } from 'components/editor/WebSite';
import { getSession } from 'lib/auth';
import { Fields } from './client';

export default async function Generator({
  searchParams: { siteId }
}: {
  searchParams: { siteId: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const site = siteId
    ? await db.site.findUnique({
        where: { id: siteId },
        include: {
          blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
        }
      })
    : null;

  return (
    <div className="flex flex-col p-8 gap-8 self-stretch flex-1 relative">
      <hgroup className="flex flex-col sm:flex-row items-center gap-1 justify-between">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          Generator
        </h1>
      </hgroup>

      <div className="flex-1 self-stretch flex gap-8 flex-col md:flex-row sticky top-0">
        <div className="flex flex-col gap-4 md:w-96">
          <Fields site={site} />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="border border-stone-200 rounded-md p-4 self-stretch flex-1">
            {site && <WebSite site={site} />}
          </div>
        </div>
      </div>
    </div>
  );
}
