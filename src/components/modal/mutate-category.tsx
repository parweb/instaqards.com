'use client';

import { Prisma } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import useTranslation from 'hooks/use-translation';
import { mutateCategory } from 'lib/actions';
import { LucideLoader2 } from 'lucide-react';
import { useModal } from './provider';

export default function CategoryMutateModal({
  site,
  category
}: {
  site: Prisma.SiteGetPayload<{
    select: {
      id: true;
    };
  }>;
  category?: Prisma.CategoryGetPayload<{
    select: {
      id: true;
      name: true;
      description: true;
    };
  }>;
}) {
  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const [data, setData] = useState(category ?? { name: '', description: '' });

  return (
    <form
      action={async (form: FormData) =>
        mutateCategory(form).then(res => {
          if ('error' in res) {
            toast.error(res.error);
            console.error(res.error);
          } else {
            router.refresh();
            modal?.hide();
            toast.success('Email saved!');
            va.track('Email saved');
          }
        })
      }
      className="w-full max-w-3xl rounded-md bg-white md:border md:border-stone-200 md:shadow-sm dark:bg-stone-800 dark:md:border-stone-700"
    >
      {category?.id && <input type="hidden" name="id" value={category.id} />}

      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.category.mutate.title')}
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
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Description
          </label>

          <AutosizeTextarea
            id="description"
            name="description"
            placeholder="Description"
            value={data?.description ?? ''}
            onChange={e => setData({ ...data, description: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10 dark:border-stone-700 dark:bg-stone-800">
        <EmailsMutateButton />
      </div>
    </form>
  );
}

function EmailsMutateButton() {
  const translate = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.email.mutate.button')}</p>
      )}
    </Button>
  );
}
