'use client';

import { Prisma } from '@prisma/client';
import va from '@vercel/analytics';
import { atom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { ProspectsTable } from 'app/app/(dashboard)/users/prospects-table';
import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import useTranslation from 'hooks/use-translation';
import { assignProspect, createUser } from 'lib/actions';
import { z } from 'zod';
import { ProspectSchema } from '../../../prisma/generated/zod';
import { useModal } from './provider';
import { LucideLoader2 } from 'lucide-react';

export const ProspectsSchema = z.object({
  data: z.array(
    ProspectSchema.merge(
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
  (params: Prisma.ProspectFindManyArgs) =>
    atom(() =>
      fetch('/api/lake/prospect/findMany?paginated', {
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
    <input
      key={`Selection-${id}`}
      type="hidden"
      name={`selected[]`}
      value={id}
    />
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
          assigneeId: { equals: null },
          ...(search !== '' && {
            OR: [
              { adresse: { contains: search } },
              { cp: { contains: search } },
              { ville: { contains: search } },
              { raison_sociale: { contains: search } },
              { email: { contains: search } },
              { tel: { contains: search } },
              { activite: { contains: search } }
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

export default function ProspectsImportModal() {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState<{ name: string; email: string }>({
    name: '',
    email: ''
  });

  return (
    <form
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:md:border-stone-700 flex flex-col gap-4"
      action={async (data: FormData) => {
        assignProspect(data).then(res => {
          if (res.error) {
            toast.error(res.error);
            console.error(res.error);
          } else {
            modal?.hide();
            router.refresh();
            toast.success('Prospects assigned!');
            va.track('Prospects assigned');
          }
        });
      }}
    >
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
