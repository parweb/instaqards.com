'use client';

import type { Link } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { deleteSite } from 'lib/actions';

const DeleteButton = ({ linkId }: { linkId: Link['id'] }) => {
  const router = useRouter();

  return (
    <form
      className="cursor-pointer"
      action={async (data: FormData) => {
        window.confirm('Are you sure you want to delete this link?') &&
          deleteSite(data, linkId, 'delete')
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
    <Button
      type="submit"
      variant="ghost"
      className="text-destructive hover:text-destructive"
      size="icon"
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <LuTrash2 />}
    </Button>
  );
}

export default DeleteButton;
