import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';
import { UserRole } from '@prisma/client';

import { WebSite } from 'components/editor/WebSite';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';

export default async function SitePosts(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const site = await db.site.findUnique({
    where: { id: decodeURIComponent(params.id) },
    include: {
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    }
  });

  if (
    !site ||
    (site.userId !== session?.user?.id && session.user.role !== UserRole.ADMIN)
  ) {
    notFound();
  }

  const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center sm:flex-row flex-1 justify-between">
          <h1 className="font-cal text-xl font-bold sm:text-3xl">
            {translate('dashboard.site.detail.title', {
              name: site.name ?? ''
            })}
          </h1>

          <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${url}`
                : `http://${site.subdomain}.localhost:11000`
            }
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 flex items-center gap-2"
          >
            {process.env.NEXT_PUBLIC_VERCEL_ENV
              ? url
              : `${site.subdomain}.localhost:11000`}
            <LuArrowUpRight />
          </a>
        </div>
      </div>

      <div className="flex flex-col flex-1 self-stretch overflow-y-auto">
        <Suspense fallback={null}>
          <WebSite site={site} />
        </Suspense>
      </div>
    </>
  );
}
