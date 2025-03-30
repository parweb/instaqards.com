'use client';

import type { ReactNode } from 'react';

import { useModal } from 'components/modal/provider';
import useTranslation from 'hooks/use-translation';
import { Button } from 'components/ui/button';

export default function UserSiteModalButton({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) {
  const modal = useModal();
  const translate = useTranslation();

  // className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"

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
