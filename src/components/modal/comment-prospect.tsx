'use client';

import type { User } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import useTranslation from 'hooks/use-translation';
import { commentProspect } from 'lib/actions';
import { useFormStatus } from 'react-dom';
import { useModal } from './provider';

export default function ProspectCommentModal({
  user
}: {
  user: Pick<User, 'id'>;
}) {
  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const [data, setData] = useState<{ comment: string }>({
    comment: ''
  });

  return (
    <form
      action={async (data: FormData) =>
        commentProspect(data).then(res => {
          if (res.error) {
            toast.error(res.error);
            console.error(res.error);
          } else {
            router.refresh();
            modal?.hide();
            toast.success('Prospects commented!');
            va.track('Prospects commented');
          }
        })
      }
      className="w-full rounded-md bg-white md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:bg-stone-800 dark:md:border-stone-700"
    >
      <input type="hidden" name="userId" value={user.id} />

      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.prospect.comment.title')}
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="comment"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Comment
          </label>

          <AutosizeTextarea
            id="comment"
            name="comment"
            placeholder="Comment"
            value={data.comment}
            onChange={e => setData({ ...data, comment: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10 dark:border-stone-700 dark:bg-stone-800">
        <ProspectCommentButton />
      </div>
    </form>
  );
}

function ProspectCommentButton() {
  const translate = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.prospect.comment.button')}</p>
      )}
    </Button>
  );
}
