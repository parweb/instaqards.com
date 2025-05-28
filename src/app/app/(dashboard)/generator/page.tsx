import { db } from 'helpers/db';
import { redirect } from 'next/navigation';

import { WebSite } from 'components/editor/WebSite';
import { getSession } from 'lib/auth';
import { Fields } from './client';

export default async function Generator(props: {
  searchParams: Promise<{ siteId: string }>;
}) {
  const searchParams = await props.searchParams;

  const { siteId } = searchParams;

  const site = siteId
    ? await db.site.findUnique({
        where: { id: siteId },
        include: {
          blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
        }
      })
    : null;

  return (
    <div className="relative flex flex-1 flex-col gap-8 self-stretch p-8">
      <hgroup className="flex flex-col items-center justify-between gap-1 sm:flex-row">
        <h1 className="font-cal text-xl font-bold sm:text-3xl dark:text-white">
          Generator
        </h1>
      </hgroup>

      <div className="sticky top-0 flex flex-1 flex-col gap-8 self-stretch md:flex-row">
        <div className="flex flex-col gap-4 md:w-96">
          <Fields site={site} />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col self-stretch rounded-md border border-stone-200 p-4">
            {site && <WebSite site={site} />}
          </div>
        </div>
      </div>
    </div>
  );
}
