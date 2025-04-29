import { UserRole } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import { LuArrowUpRight } from 'react-icons/lu';

import { db } from 'helpers/db';
import { getSession } from 'lib/auth';
import { uri } from 'settings';

export default async function SiteSubscribers(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  const site = await db.site.findUnique({
    where: { id: decodeURIComponent(params.id) }
  });

  if (
    !site ||
    (site.userId !== session?.user?.id &&
      !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
        session?.user.role
      ))
  ) {
    notFound();
  }

  const subscribers = await db.subscriber.findMany({
    where: { siteId: site.id }
  });

  return (
    <div className="p-8 flex flex-col gap-6 flex-1 self-stretch">
      <div className="flex flex-col items-center sm:flex-row justify-between">
        <h1 className="font-cal text-xl font-bold sm:text-3xl">
          Subscribers for {site.name}
        </h1>

        <a
          href={uri.site(site).link}
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 flex items-center gap-2"
        >
          {uri.site(site).title} <LuArrowUpRight />
        </a>
      </div>

      <div className="flex-1 self-stretch flex flex-col gap-4 ">
        {subscribers.map(subscriber => (
          <div key={subscriber.id}>{subscriber.email}</div>
        ))}
      </div>
    </div>
  );
}
