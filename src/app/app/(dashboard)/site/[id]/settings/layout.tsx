import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { db } from 'helpers';
import { getSession } from 'lib/auth';
import SiteSettingsNav from './nav';

export default async function SiteAnalyticsLayout({
  params,
  children
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const site = await db.site.findUnique({
    where: { id: decodeURIComponent(params.id) }
  });

  if (
    !site ||
    (site.userId !== session?.user?.id && session.user.role !== 'ADMIN')
  ) {
    notFound();
  }

  const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col items-center space-x-4 space-y-2 sm:flex-row sm:space-y-0 flex-1 justify-between">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          Settings for {site.name}
        </h1>

        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${site.subdomain}.localhost:11000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {process.env.NEXT_PUBLIC_VERCEL_ENV
            ? url
            : `${site.subdomain}.localhost:11000`}
          ↗
        </a>
      </div>

      <SiteSettingsNav />

      {children}
    </>
  );
}
