import Link from 'next/link';

import { db } from 'helpers/db';
import { getAuth } from 'lib/auth';
import CreateSiteButton from './create-site-button';
import CreateSiteModal from './modal/create-site';

export default async function OverviewSitesCTA() {
  const auth = await getAuth();

  const sites = await db.site.count({
    where: {
      userId: auth.id
    }
  });

  return sites > 0 ? (
    <Link
      prefetch
      href="/sites"
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
    >
      View All Sites
    </Link>
  ) : (
    <CreateSiteButton>
      <CreateSiteModal />
    </CreateSiteButton>
  );
}
