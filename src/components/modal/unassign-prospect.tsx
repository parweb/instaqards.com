'use client';

import type { User } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import useTranslation from 'hooks/use-translation';
import { unassignProspect } from 'lib/actions';
import { useFormStatus } from 'react-dom';
import { useModal } from './provider';

export default function ProspectUnassignModal({
  user
}: {
  user: Pick<User, 'id'>;
}) {
  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const [data, setData] = useState<{ reason: string }>({
    reason: ''
  });

  return (
    <form
      action={async (data: FormData) =>
        unassignProspect(data).then(res => {
          if (res.error) {
            toast.error(res.error);
            console.error(res.error);
          } else {
            router.refresh();
            modal?.hide();
            toast.success('Prospects assigned!');
            va.track('Prospects assigned');
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:md:border-stone-700"
    >
      <input type="hidden" name="selected[]" value={user.id} />

      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.prospect.unassign.title')}
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="reason"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Reason
          </label>

          <Input
            id="reason"
            name="reason"
            placeholder="Reason"
            value={data.reason}
            onChange={e => setData({ ...data, reason: e.target.value })}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-hidden focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <ProspectUnassignButton />
      </div>
    </form>
  );
}

function ProspectUnassignButton() {
  const translate = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.prospect.unassign.button')}</p>
      )}
    </Button>
  );
}
