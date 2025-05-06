'use client';

import { Prisma, UserRole } from '@prisma/client';
import va from '@vercel/analytics';
import { atom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { ProspectsTable } from 'app/app/(dashboard)/users/prospects-table';
import LoadingDots from 'components/icons/loading-dots';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import useTranslation from 'hooks/use-translation';
import { mutateLists } from 'lib/actions';
import { LucideLoader2 } from 'lucide-react';
import { UserSchema } from '../../../prisma/generated/zod';
import { useModal } from './provider';

export const ProspectsSchema = z.object({
  data: z.array(
    UserSchema.merge(
      z.object({
        id: z.string()
      })
    )
  ),
  total: z.number(),
  take: z.number().nullable(),
  skip: z.number().nullable()
});

const $prospects = atomFamily(
  (params: Prisma.UserFindManyArgs) =>
    atom(() =>
      fetch('/api/lake/user/findMany?paginated', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(data => ProspectsSchema.parse(data))
    ),
  isEqual
);

const $page = atom(1);
const $take = atom(5);
const $search = atom('');
const $selection = atom<
  z.infer<typeof ProspectsSchema>['data'][number]['id'][]
>([]);

const Selection = () => {
  const selection = useAtomValue($selection);

  return selection.map(id => (
    <input key={`Selection-${id}`} type="hidden" name="selected[]" value={id} />
  ));
};

const Prospects = () => {
  const search = useAtomValue($search);
  const take = useAtomValue($take);
  const page = useAtomValue($page);

  return (
    <ProspectsTable
      $selection={$selection}
      $prospects={$prospects({
        where: {
          bounced: { lte: 0 },
          ...(search !== '' && {
            OR: [
              { address: { contains: search } },
              { postcode: { contains: search } },
              { city: { contains: search } },
              { company: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
              { activity: { contains: search } }
            ]
          })
        },
        take,
        skip: (page - 1) * take
      })}
      $page={$page}
      $take={$take}
      $search={$search}
    />
  );
};

export default function ListsMutateModal({
  list
}: {
  list?: Prisma.ListGetPayload<{ include: { owners: true; contacts: true } }>;
}) {
  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const [data, setData] = useState(
    list ?? { title: '', description: '', contacts: [] }
  );

  return (
    <form
      action={async (data: FormData) =>
        mutateLists(data).then(res => {
          if ('error' in res) {
            toast.error(res.error);
            console.error(res.error);
          } else {
            router.refresh();
            modal?.hide();
            toast.success('List saved!');
            va.track('List saved');
          }
        })
      }
      className="w-full rounded-md bg-white max-w-3xl md:border md:border-stone-200 md:shadow-sm dark:md:border-stone-700 dark:bg-stone-800"
    >
      {list?.id && <input type="hidden" name="id" value={list.id} />}

      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.list.mutate.title')}
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

        <Suspense fallback={null}>
          <Selection />
        </Suspense>

        <Suspense
          fallback={
            <div className="flex items-center justify-center p-4">
              <LucideLoader2 className="animate-spin" />
            </div>
          }
        >
          <Prospects />
        </Suspense>
      </div>

      <div className="flex flex-col items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <ListsMutateButton />
      </div>
    </form>
  );
}

function ListsMutateButton() {
  const translate = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.list.mutate.button')}</p>
      )}
    </Button>
  );
}
