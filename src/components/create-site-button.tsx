'use client';

import { ReactNode } from 'react';

import { useModal } from 'components/modal/provider';
import useTranslation from 'hooks/use-translation';

export default function CreateSiteButton({
  children
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  const translate = useTranslation();

  return (
    <button
      onClick={() => modal?.show(children)}
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
    >
      {translate('components.site.create.button')}
    </button>
  );
}
