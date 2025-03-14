import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getSession } from 'lib/auth';
import LogoutButton from './logout-button';

export default async function Profile() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex-1 flex gap-1 items-center justify-between">
      <Link
        href="/settings"
        className="flex-1 flex gap-2 items-center p-2 rounded-lg transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300"
      >
        <Image
          src={
            session.user.image ??
            `https://avatar.vercel.sh/${session.user.email}`
          }
          width={40}
          height={40}
          alt={session.user.name ?? 'User avatar'}
          className="h-6 w-6 rounded-full"
        />

        <span className="truncate text-sm font-medium">
          {session.user.name || session.user.email}
        </span>
      </Link>

      <LogoutButton />
    </div>
  );
}
