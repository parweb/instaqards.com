'use client';

import type { ReactNode } from 'react';

import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';

export default function UserSiteModalButton({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) {
  const modal = useModal();

  return (
    <Button
      type="button"
      onClick={() => modal?.show(children)}
      variant="ghost"
      className="text-sm text-gray-900 hover:bg-gray-100"
    >
      {label}
    </Button>
  );
}
