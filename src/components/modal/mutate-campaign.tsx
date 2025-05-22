'use client';

import { CampaignType, Prisma } from '@prisma/client';
import va from '@vercel/analytics';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { FaMagic } from 'react-icons/fa';
import { Suspense, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import LoadingDots from 'components/icons/loading-dots';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import useTranslation from 'hooks/use-translation';
import { mutateCampaigns } from 'lib/actions';
import { LucideLoader2 } from 'lucide-react';
import { Switch } from 'components/ui/switch';
import { useModal } from './provider';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

import {
  EmailSchema,
  ListSchema,
  UserSchema
} from '../../../prisma/generated/zod';
import { Badge } from 'components/ui/badge';
import { cn } from 'lib/utils';

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

const $selectionLists =
  atom<z.infer<typeof ListsSchema>['data'][number]['id']>();

const Lists = ({ defaultValue }: { defaultValue?: string }) => {
  const [selection, setSelection] = useAtom($selectionLists);
  const lists = useAtomValue(
    $lists({
      include: { contacts: true },
      orderBy: { updatedAt: 'desc' }
    })
  );

  return (
    <RadioGroup
      defaultValue={defaultValue}
      name="list"
      value={selection}
      onValueChange={setSelection}
    >
      {lists.data.map(list => (
        <div key={list.id} className="flex items-center space-x-2">
          <RadioGroupItem value={list.id} id={list.id} />
          <Label htmlFor={list.id}>
            {list.title} ({list.contacts.length})
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export const EmailsSchema = z.object({
  data: z.array(
    EmailSchema.merge(
      z.object({
        id: z.string()
        // contacts: z.array(
        //   UserSchema.merge(
        //     z.object({
        //       id: z.string()
        //     })
        //   )
        // )
      })
    )
  ),
  total: z.number(),
  take: z.number().nullable(),
  skip: z.number().nullable()
});

const $emails = atomFamily(
  (params: Prisma.EmailFindManyArgs) =>
    atom(() =>
      fetch('/api/lake/email/findMany?paginated', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(data => EmailsSchema.parse(data))
    ),
  isEqual
);

const $selectionEmails =
  atom<z.infer<typeof EmailsSchema>['data'][number]['id']>();

const Emails = ({ defaultValue }: { defaultValue?: string }) => {
  const [selection, setSelection] = useAtom($selectionEmails);
  const emails = useAtomValue(
    $emails({
      // include: { contacts: true },
      orderBy: { updatedAt: 'desc' }
    })
  );

  return (
    <RadioGroup
      defaultValue={defaultValue}
      name="email"
      value={selection}
      onValueChange={setSelection}
    >
      {emails.data.map(email => (
        <div key={email.id} className="flex items-center space-x-2">
          <RadioGroupItem value={email.id} id={email.id} />
          <Label htmlFor={email.id}>{email.title}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default function CampaignsMutateModal({
  campaign
}: {
  campaign?: Prisma.CampaignGetPayload<{
    include: { list: true; email: true };
  }>;
}) {
  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const [data, setData] = useState(
    campaign ?? {
      title: '',
      description: '',
      type: CampaignType.email
    }
  );

  return (
    <form
      className="grid grid-rows-[1fr,auto] flex-col w-full rounded-md bg-white max-w-3xl md:border md:border-stone-200 md:shadow-sm max-h-[90dvh] overflow-y-scroll"
      action={async (data: FormData) =>
        mutateCampaigns(data).then(res => {
          if ('error' in res) {
            toast.error(res.error);
            console.error(res.error);
          } else {
            router.refresh();
            modal?.hide();
            toast.success('Campaign saved!');
            va.track('Campaign saved');
          }
        })
      }
    >
      {campaign?.id && <input type="hidden" name="id" value={campaign.id} />}

      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.campaign.mutate.title')}
        </h2>

        <Select
          name="type"
          value={data.type}
          onValueChange={async value => {
            // @ts-ignore
            setData({ ...data, type: value as CampaignType });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Résultats" />
          </SelectTrigger>

          <SelectContent>
            {Object.values(CampaignType).map(type => (
              <SelectItem
                key={type}
                value={type}
                disabled={type !== CampaignType.email}
              >
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="group flex items-center">
          <Button
            variant="outline"
            className={
              'flex items-center space-x-2 has-[.peer[data-state=checked]]:bg-green-100 has-[.peer[data-state=checked]]:text-white'
            }
            asChild
          >
            <Label>
              <Switch name="smart" className="peer" />

              <Badge
                className={cn(
                  'flex items-center gap-1 rounded-full peer-data-[state=checked]:bg-green-500 hover:peer-data-[state=checked]:bg-green-700  peer-data-[state=checked]:text-green-900',
                  'peer-data-[state=checked]:text-white'
                )}
              >
                <FaMagic /> Smart
              </Badge>
            </Label>
          </Button>
        </div>

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

        <Suspense
          fallback={
            <div className="flex items-center justify-center p-4">
              <LucideLoader2 className="animate-spin" />
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-medium">
                {translate('components.campaign.mutate.list')}
              </h4>

              <div className="max-h-[150px] overflow-y-auto">
                <Lists defaultValue={campaign?.list?.id} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-medium">
                {translate('components.campaign.mutate.email')}
              </h4>

              <div className="max-h-[150px] overflow-y-auto">
                <Emails defaultValue={campaign?.email?.id} />
              </div>
            </div>
          </div>
        </Suspense>
      </div>

      <div className="flex flex-col items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CampaignsMutateButton />
      </div>
    </form>
  );
}

function CampaignsMutateButton() {
  const translate = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.campaign.mutate.button')}</p>
      )}
    </Button>
  );
}
