'use client';

import type { ReactNode } from 'react';

import { useModal } from 'components/modal/provider';
import useTranslation from 'hooks/use-translation';
import { LuPencil } from 'react-icons/lu';

export default function UpdateSiteDescriptionButton({
  children
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  const translate = useTranslation();

  return (
    <button
      aria-label={translate('components.site.update.description')}
      type="button"
      onClick={() => modal?.show(children)}
      className="bg-black text-white rounded-full p-2 w-8 h-8 flex items-center justify-center"
    >
      <LuPencil />
    </button>
  );
}
