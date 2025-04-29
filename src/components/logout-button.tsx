'use client';

import { useRouter } from 'next/navigation';

import { signOut } from 'lib/auth/client';
import { DropdownMenuItem } from './ui/dropdown-menu';

export default function LogoutButton({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={() =>
        signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();
            }
          }
        })
      }
    >
      {children}
    </DropdownMenuItem>
  );
}
