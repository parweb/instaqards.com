'use client';

import type { ReactNode } from 'react';

import { useModal } from 'components/modal/provider';
import useTranslation from 'hooks/use-translation';
import { LuPencil } from 'react-icons/lu';

export default function UpdateSiteProfilePictureButton({
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
      className="flex h-10 w-10 items-center justify-center rounded-full bg-black p-2 text-white"
    >
      <LuPencil />
    </button>
  );
}
