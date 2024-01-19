'use client';

import { ReactNode } from 'react';
import { useModal } from '@/components/modal/provider';
import { LuPencil } from 'react-icons/lu';

export default function UpdateLinkButton({
  children
}: {
  children: ReactNode;
}) {
  const modal = useModal();

  return (
    <button
      onClick={() => modal?.show(children)}
      className="bg-white/80 p-2 rounded-md"
    >
      <LuPencil />
    </button>
  );
}
