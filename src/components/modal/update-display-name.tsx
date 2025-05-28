'use client';

import type { Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import useTranslation from 'hooks/use-translation';
import { updateSite } from 'lib/actions';
import { cn } from 'lib/utils';
import { useModal } from './provider';
import { useFormStatus } from 'react-dom';

export default function UpdateSiteDisplayNameModal({
  siteId,
  displayName
}: {
  siteId: Site['id'];
  displayName: Site['display_name'];
}) {
  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const [data, setData] = useState<{ label: string }>({
    label: displayName ?? ''
  });

  return (
    <form
      action={async (data: FormData) =>
        updateSite(data, siteId, 'display_name').then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Update site display name', { id: siteId });

            router.refresh();
            modal?.hide();
            toast.success('Site display name updated!');
          }
        })
      }
      className="w-full rounded-md bg-white md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:bg-black dark:md:border-stone-700"
    >
      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.site.updateDisplayName.title')}
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="display_name"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Label
          </label>

          <input
            id="display_name"
            name="display_name"
            type="text"
            placeholder="Label"
            value={data.label}
            onChange={e => setData({ ...data, label: e.target.value })}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:ring-black focus:outline-hidden dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10 dark:border-stone-700 dark:bg-stone-800">
        <UpdateSiteDisplayNameFormButton />
      </div>
    </form>
  );
}

function UpdateSiteDisplayNameFormButton() {
  const translate = useTranslation();
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={cn(
        'flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-hidden',
        pending
          ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
          : 'border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800'
      )}
      disabled={pending}
    >
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.site.updateDisplayName.button')}</p>
      )}
    </button>
  );
}
