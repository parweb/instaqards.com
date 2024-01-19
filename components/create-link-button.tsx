'use client';

import { ReactNode } from 'react';
import { useModal } from '@/components/modal/provider';
import { LuTrash2 } from 'react-icons/lu';
import { deleteLink } from '@/lib/actions';
import { Link, Site } from '@prisma/client';
import { toast } from 'sonner';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CreateLinkButton({
  type,
  children
}: {
  type: Link['type'];
  children: ReactNode;
}) {
  const modal = useModal();

  if (type === 'main') {
    return (
      <button
        onClick={() => modal?.show(children)}
        className={cn(
          'transition-all',
          'border border-white/90 bg-white/90 rounded-md p-3 text-black w-full text-center',
          'hover:bg-transparent hover:text-white/90'
        )}
      >
        + Add a link
      </button>
    );
  }

  if (type === 'social') {
    return (
      <button
        onClick={() => modal?.show(children)}
        className="border border-white/90 rounded-full bg-white text-black h-[45px] aspect-square hover:bg-transparent hover:text-white/90 transition-all hover:scale-125"
      >
        +
      </button>
    );
  }

  return <></>;
}
