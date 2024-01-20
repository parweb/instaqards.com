'use client';

import { Link } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';

import LoadingDots from '@/components/icons/loading-dots';
import { deleteLink } from '@/lib/actions';

export default function DeleteLinkButton(link: Link) {
  const router = useRouter();
  const { pending } = useFormStatus();

  return (
    <form
      action={async (data: FormData) =>
        deleteLink(link.id).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track('Delete link', { id: link.id });

            router.refresh();
            toast.success(`Link updated!`);
          }
        })
      }
    >
      <DeleteLinkFormButton />
    </form>
  );
}

function DeleteLinkFormButton() {
  const { pending } = useFormStatus();

  return (
    <button className="bg-white/80 p-2 rounded-md" disabled={pending}>
      {pending ? <LoadingDots color="#808080" /> : <LuTrash2 />}
    </button>
  );
}
