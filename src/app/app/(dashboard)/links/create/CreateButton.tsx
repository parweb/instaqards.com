'use client';

import type { ReactNode } from 'react';

import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';

export function CreateButton({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) {
  const modal = useModal();

  return (
    <Button type="button" onClick={() => modal?.show(children)}>
      {label}
    </Button>
  );
}
