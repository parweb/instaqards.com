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
import { updateUser } from 'lib/actions';
import { useFormStatus } from 'react-dom';
import { useModal } from './provider';

export default function UserUpdateModal({ user }: { user: User }) {
  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const [data, setData] = useState<{ email: string; name: string }>({
    email: user.email ?? '',
    name: user.name ?? ''
  });

  return (
    <form
      action={async (data: FormData) =>
        updateUser(data, user.id).then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Update user', { id: user.id });

            router.refresh();
            modal?.hide();
            toast.success('User updated!');
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:md:border-stone-700"
    >
      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.user.update.title')}
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Name
          </label>

          <Input
            id="name"
            name="name"
            placeholder="Name"
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-hidden focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Email
          </label>

          <Input
            id="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={e => setData({ ...data, email: e.target.value })}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-hidden focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <UpdateUserFormButton />
      </div>
    </form>
  );
}

function UpdateUserFormButton() {
  const translate = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.user.update.button')}</p>
      )}
    </Button>
  );
}
