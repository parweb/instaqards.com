'use client';

import type { Block } from '@prisma/client';
import type { ReactNode } from 'react';
import { LuPlus } from 'react-icons/lu';

import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';
import useTranslation from 'hooks/use-translation';
import { cn } from 'lib/utils';

export default function CreateBlockButton({
  type,
  children
}: {
  type: Block['type'];
  children: ReactNode;
}) {
  const modal = useModal();
  const translate = useTranslation();

  if (type === 'main') {
    return (
      <Button
        type="button"
        onClick={() => modal?.show(children)}
        className={cn(
          'transition-all duration-300',
          'border border-white/90 bg-white/90 rounded-md p-3 text-black w-full text-center',
          'hover:bg-transparent hover:text-white/90'
        )}
      >
        <LuPlus />
        {translate('components.create.block.button')}
      </Button>
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
