'use client';

import type { ReactNode } from 'react';

import { useModal } from 'components/modal/provider';
import useTranslation from 'hooks/use-translation';
import { LuPencil } from 'react-icons/lu';

export default function UpdateSiteDisplayNameButton({
  children
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  const translate = useTranslation();

  return (
    <button
      aria-label={translate('components.site.update.profile-picture')}
      type="button"
      onClick={() => modal?.show(children)}
      className="bg-black text-white rounded-full p-2 w-10 h-10 flex items-center justify-center"
    >
      <LuPencil />
    </button>
  );
}
