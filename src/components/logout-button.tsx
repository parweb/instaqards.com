'use client';

import { signOut } from 'next-auth/react';
import { DropdownMenuItem } from './ui/dropdown-menu';

export default function LogoutButton({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuItem onClick={() => signOut()}>{children}</DropdownMenuItem>
  );
}
