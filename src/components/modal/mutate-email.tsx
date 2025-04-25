'use client';

import { Prisma } from '@prisma/client';
import va from '@vercel/analytics';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import { toast } from 'sonner';
import { z } from 'zod';

import LoadingDots from 'components/icons/loading-dots';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import useTranslation from 'hooks/use-translation';
import { mutateEmails } from 'lib/actions';
import { LucideLoader2 } from 'lucide-react';
import { ListSchema, UserSchema } from '../../../prisma/generated/zod';
import { useModal } from './provider';

export const ListsSchema = z.object({
  data: z.array(
    ListSchema.merge(
      z.object({
        id: z.string(),
        contacts: z.array(
          UserSchema.merge(
            z.object({
              id: z.string()
            })
          )
        )
      })
    )
  ),
  total: z.number(),
  take: z.number().nullable(),
  skip: z.number().nullable()
});

const $lists = atomFamily(
  (params: Prisma.ListFindManyArgs) =>
    atom(() =>
      fetch('/api/lake/list/findMany?paginated', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(data => ListsSchema.parse(data))
    ),
  isEqual
);

const $selection = atom<z.infer<typeof ListsSchema>['data'][number]['id']>();

export default function EmailsMutateModal({
  email
}: {
  email?: Prisma.EmailGetPayload<{}>;
}) {
  const emailEditorRef = useRef<EditorRef>(null);

  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const [data, setData] = useState(
    email ?? { title: '', description: '', subject: '', design: {} }
  );

  const onReady: EmailEditorProps['onReady'] = unlayer => {
    const design = JSON.parse(JSON.stringify(data.design));

    unlayer.loadDesign(design);
  };

  return (
    <form
      action={async (form: FormData) => {
        const unlayer = emailEditorRef.current?.editor;

        unlayer?.exportHtml(data => {
          const { design, html } = data;

          form.append('content', html);
          form.append('design', JSON.stringify(design));

          mutateEmails(form).then(res => {
            if ('error' in res) {
              toast.error(res.error);
              console.error(res.error);
            } else {
              router.refresh();
              modal?.hide();
              toast.success('Email saved!');
              va.track('Email saved');
            }
          });
        });
      }}
      className="w-full rounded-md bg-white max-w-3xl md:border md:border-stone-200 md:shadow-sm dark:md:border-stone-700 dark:bg-stone-800"
    >
      {email?.id && <input type="hidden" name="id" value={email.id} />}

      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.email.mutate.title')}
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Title
          </label>

          <Input
            id="title"
            name="title"
            placeholder="Title"
            value={data.title}
            onChange={e => setData({ ...data, title: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
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
            value={data?.subject ?? ''}
            onChange={e => setData({ ...data, subject: e.target.value })}
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

        <EmailEditor ref={emailEditorRef} onReady={onReady} />

        <Suspense
          fallback={
            <div className="flex items-center justify-center p-4">
              <LucideLoader2 className="animate-spin" />
            </div>
          }
        >
          {/* <Lists defaultValue={email?.list?.id} /> */}
        </Suspense>
      </div>

      <div className="flex flex-col items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
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
