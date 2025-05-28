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
          'w-full rounded-md border border-white/90 bg-white/90 p-3 text-center text-black',
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
        className="aspect-square h-[45px] rounded-full border border-white/90 bg-white text-black transition-all hover:scale-125 hover:bg-transparent hover:text-white/90"
      >
        +
      </button>
    );
  }

  return <></>;
}
