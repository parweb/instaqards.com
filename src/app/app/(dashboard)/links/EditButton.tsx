'use client';

import type { ReactNode } from 'react';
import { LuPencil } from 'react-icons/lu';

import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';

export function EditButton({ children }: { children: ReactNode }) {
  const modal = useModal();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => modal?.show(children)}
    >
      <LuPencil />
    </Button>
  );
}
