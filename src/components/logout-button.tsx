'use client';

import { signOut } from 'next-auth/react';
import { DropdownMenuItem } from './ui/dropdown-menu';

export default function LogoutButton({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DropdownMenuItem onClick={() => signOut()}>{children}</DropdownMenuItem>
  );
}
