'use client';

import type { ReactNode } from 'react';
import { LuPencil } from 'react-icons/lu';

import { useModal } from 'components/modal/provider';

export default function UpdateBlockButton({
  children
}: {
  children: ReactNode;
}) {
  const modal = useModal();

  return (
    <button
      type="button"
      onClick={() => modal?.show(children)}
      className="bg-white/80 p-2 rounded-md"
    >
      <LuPencil />
    </button>
  );
}
