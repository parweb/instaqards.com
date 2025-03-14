'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="rounded-lg p-2 text-stone-700 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300"
    >
      <LogOut width={18} />
    </button>
  );
}
