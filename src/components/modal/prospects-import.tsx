'use client';

import { UserRole } from '@prisma/client';
import va from '@vercel/analytics';
import { atom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useFormStatus } from 'react-dom';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';

import { ProspectsTable } from 'app/app/(dashboard)/users/prospects-table';
import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { $ } from 'helpers/$';
import useTranslation from 'hooks/use-translation';
import { assignProspect } from 'lib/actions';
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

  const x = $.user.findMany({
    paginated: true,
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      address: true,
      postcode: true,
      city: true,
      phone: true,
      activity: true
    },
    where: {
      bounced: { lte: 0 },
      refererId: { equals: null },
      role: UserRole.LEAD,
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
  });

  return (
    <ProspectsTable
      $selection={$selection}
      $prospects={$.user.findMany({
        paginated: true,
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          address: true,
          postcode: true,
          city: true,
          phone: true,
          activity: true
        },
        where: {
          bounced: { lte: 0 },
          refererId: { equals: null },
          role: UserRole.LEAD,
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

export default function ProspectsImportModal() {
  const router = useRouter();
  const modal = useModal();

  return (
    <form
      className="flex w-full flex-col gap-4 rounded-md bg-white md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:bg-black dark:md:border-stone-700"
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
            <LuLoader className="animate-spin" />
          </div>
        }
      >
        <Prospects />
      </Suspense>

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
        <p>{translate('components.user.create.button')}</p>
      )}
    </Button>
  );
}
