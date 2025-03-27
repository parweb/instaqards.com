'use client';

import type { Link } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { useModal } from 'components/modal/provider';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import useTranslation from 'hooks/use-translation';
import { mutateLink } from 'lib/actions';
import { cn } from 'lib/utils';

type MutateModalProps = {
  link: Link | null;
};

export function MutateModal({ link }: MutateModalProps) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    url: link?.url ?? '',
    name: link?.name ?? '',
    description: link?.description ?? '',
    id: link?.id ?? null
  });

  return (
    <form
      action={async (data: FormData) =>
        mutateLink(data).then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Created Link');
            router.refresh();
            modal?.hide();
            toast.success('Successfully created link!');
          }
        })
      }
      className="w-full rounded-md bg-white md:max-w-md md:border md:border-stone-200 md:shadow-sm"
    >
      {link && <input type="hidden" name="id" value={link.id} />}

      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl">Create a new link</h2>

        <div className="flex flex-col space-y-2">
          <label htmlFor="url" className="text-sm font-medium text-stone-500">
            URL
          </label>

          <Input
            id="url"
            name="url"
            type="text"
            placeholder="https://my-awesome-site.com"
            value={data.url}
            onChange={e => setData({ ...data, url: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-stone-500">
            Name
          </label>

          <Input
            id="name"
            name="name"
            type="text"
            placeholder="My Awesome Link"
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-stone-500"
          >
            Description
          </label>

          <AutosizeTextarea
            id="description"
            name="description"
            placeholder="Description about why my site is so awesome"
            value={data.description}
            onChange={e => setData({ ...data, description: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10">
        <CreateModalButton />
      </div>
    </form>
  );
}

function CreateModalButton() {
  const { pending } = useFormStatus();

  const translate = useTranslation();

  return (
    <Button
      type="submit"
      className={cn(
        pending
          ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400'
          : 'border-black bg-black text-white hover:bg-white hover:text-black'
      )}
      disabled={pending}
    >
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('dashboard.links.create')}</p>
      )}
    </Button>
  );
}
