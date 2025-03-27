'use client';

import type { ReactNode } from 'react';
import { LuPlus } from 'react-icons/lu';

import { useModal } from 'components/modal/provider';

export default function CreateSiteButtonSidebar({
  children
}: {
  children: ReactNode;
}) {
  const modal = useModal();

  return (
    <LuPlus
      type="button"
      size="icon"
      onClick={() => modal?.show(children)}
      className="text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 cursor-pointer"
    />
  );
}
