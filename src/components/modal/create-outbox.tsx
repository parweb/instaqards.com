'use client';

import { User } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import useTranslation from 'hooks/use-translation';
import { createOutbox } from 'lib/actions';
import { useModal } from './provider';

export default function OutboxCreateModal({
  user
}: {
  user: Pick<User, 'id' | 'name' | 'email'>;
}) {
  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const [data, setData] = useState<{ subject: string; body: string }>({
    subject: '',
    body: ''
  });

  return (
    <form
      action={async (data: FormData) =>
        createOutbox(data).then(res => {
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
      className="w-full rounded-md bg-white md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:bg-black dark:md:border-stone-700"
    >
      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.outbox.create.title')}
        </h2>

        <div className="flex flex-col gap-4">
          <input type="hidden" name="user" value={user?.id} />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="subject"
              className="text-sm font-medium text-stone-500 dark:text-stone-400"
            >
              Subject
            </label>

            <Input
              id="subject"
              name="subject"
              placeholder="Subject"
              value={data.subject}
              onChange={e => setData({ ...data, subject: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="body"
              className="text-sm font-medium text-stone-500 dark:text-stone-400"
            >
              Body
            </label>

            <AutosizeTextarea
              id="body"
              name="body"
              placeholder="Body"
              value={data.body}
              onChange={e => setData({ ...data, body: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10 dark:border-stone-700 dark:bg-stone-800">
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
        <p>{translate('components.outbox.create.button')}</p>
      )}
    </Button>
  );
}
