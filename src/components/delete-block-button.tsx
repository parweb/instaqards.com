'use client';

import type { Prisma } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { deleteBlock } from 'lib/actions';

export default function DeleteBlockButton(
  block: Prisma.BlockGetPayload<{ select: { id: true } }>
) {
  const router = useRouter();

  return (
    <form
      action={async () =>
        deleteBlock(block.id).then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Delete block', { id: block.id });

            router.refresh();
            toast.success('Block deleted!');
          }
        })
      }
    >
      <DeleteBlockFormButton />
    </form>
  );
}

function DeleteBlockFormButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-md bg-white/80 p-2"
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <LuTrash2 />}
    </button>
  );
}
