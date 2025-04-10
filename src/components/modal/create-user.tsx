'use client';

import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import useTranslation from 'hooks/use-translation';
import { createUser } from 'lib/actions';
import { useModal } from './provider';

export default function UserCreateModal() {
  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const [data, setData] = useState<{ name: string; email: string }>({
    name: '',
    email: ''
  });

  return (
    <form
      action={async (data: FormData) =>
        createUser(data).then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Create user');

            router.refresh();
            modal?.hide();
            toast.success('User created!');
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:md:border-stone-700"
    >
      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.user.create.title')}
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
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
            />
          </div>

          <div className="flex flex-col gap-2">
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
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreateUserFormButton />
      </div>
    </form>
  );
}

function CreateUserFormButton() {
  const translate = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.user.create.button')}</p>
      )}
    </Button>
  );
}
