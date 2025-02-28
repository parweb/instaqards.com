'use client';

import type { Link } from '@prisma/client';
import type { ReactNode } from 'react';

import { useModal } from 'components/modal/provider';
import useTranslation from 'hooks/use-translation';
import { cn } from 'lib/utils';

export default function CreateLinkButton({
  type,
  children
}: {
  type: Link['type'];
  children: ReactNode;
}) {
  const modal = useModal();
  const translate = useTranslation();

  if (type === 'main') {
    return (
      <button
        type="button"
        onClick={() => modal?.show(children)}
        className={cn(
          'transition-all',
          'border border-white/90 bg-white/90 rounded-md p-3 text-black w-full text-center',
          'hover:bg-transparent hover:text-white/90'
        )}
      >
        {`+ ${translate('components.create.link.button')}`}
      </button>
    );
  }

  if (type === 'social') {
    return (
      <button
        type="button"
        onClick={() => modal?.show(children)}
        className="border border-white/90 rounded-full bg-white text-black h-[45px] aspect-square hover:bg-transparent hover:text-white/90 transition-all hover:scale-125"
      >
        +
      </button>
    );
  }

  return <></>;
}
