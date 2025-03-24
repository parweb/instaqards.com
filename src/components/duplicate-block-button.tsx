'use client';

import type { Block } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { LuCopy } from 'react-icons/lu';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { duplicateBlock } from 'lib/actions';

export default function DuplicateBlockButton(block: Block) {
  const router = useRouter();

  return (
    <form
      action={async () =>
        duplicateBlock(block.id).then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Duplicate block', { id: block.id });

            router.refresh();
            toast.success('Block duplicated!');
          }
        })
      }
    >
      <DuplicateBlockFormButton />
    </form>
  );
}

function DuplicateBlockFormButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-white/80 p-2 rounded-md"
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <LuCopy />}
    </button>
  );
}
