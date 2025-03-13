'use client';

import type { Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { deleteSite } from 'lib/actions';
import { cn } from 'lib/utils';

const DeleteButton = ({ siteId }: { siteId: Site['id'] }) => {
  const router = useRouter();

  return (
    <form
      className="cursor-pointer"
      action={async (data: FormData) => {
        window.confirm('Are you sure you want to delete your site?') &&
          deleteSite(data, siteId, 'delete')
            .then(async res => {
              if ('error' in res) {
                toast.error(res.error);
              } else {
                va.track('Deleted Site');
                router.refresh();
                router.push('/sites');
                toast.success('Successfully deleted site!');
              }
            })
            .catch((err: Error) => toast.error(err.message));
      }}
    >
      <FormButton />
    </form>
  );
};

function FormButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'flex items-center justify-center transition-all',
        pending
          ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
          : 'text-red-600'
      )}
    >
      {pending ? <LoadingDots color="#808080" /> : <LuTrash2 />}
    </button>
  );
}

export default DeleteButton;
