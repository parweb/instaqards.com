import { UserRole } from '@prisma/client';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import { db } from 'helpers/db';
import { getAuth } from 'lib/auth';
import { uri } from 'settings';
import SiteSettingsNav from './nav';

export default async function SiteAnalyticsLayout(props: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  const { children } = props;
  const params = await props.params;

  const [auth, site] = await Promise.all([
    getAuth(),
    db.site.findUnique({
      where: { id: decodeURIComponent(params.id) }
    })
  ]);

  if (
    !site ||
    (site.userId !== auth.id &&
      !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(auth.role))
  ) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 self-stretch p-8">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <h1 className="font-cal text-xl font-bold sm:text-3xl">
          Settings for {site.name}
        </h1>

        <a
          href={uri.site(site).link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
        >
          {uri.site(site).title}
          <LuArrowUpRight />
        </a>
      </div>

      <SiteSettingsNav />

      {children}
    </div>
  );
}
