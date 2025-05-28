'use client';

import type { Block, Site } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBlock, updateBlock } from 'lib/actions';
import va from '@vercel/analytics';
import { toast } from 'sonner';

import { BlockFormButton } from 'components/editor/form/BlockFormButton';
import { BlockPicker } from 'components/editor/form/BlockPicker';
import { cn } from 'lib/utils';
import { useModal } from 'components/modal/provider';

export function BlockFormSocial({
  mode,
  initialData,
  siteId
}: {
  mode: {
    id: Block['id'] | null;
    mode: 'create' | 'update';
    type: Block['type'];
    title: string;
  };
  initialData: {
    label: string;
    href: string;
    logo: string;
  };
  siteId: Site['id'];
}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState(initialData);

  return (
    <form
      action={async (form: FormData) => {
        if (mode.mode === 'create') {
          createBlock(form, siteId, 'social').then(res => {
            if ('error' in res) {
              toast.error(res.error);
            } else {
              va.track('Create block', { id: res.id });
              router.refresh();
              modal?.hide();
              toast.success('Block created!');
            }
          });
        } else {
          const id = form.get('id') as Block['id'];

          updateBlock(form, siteId, id).then(res => {
            if ('error' in res) {
              toast.error(res.error);
            } else {
              va.track('Update block', { id });
              router.refresh();
              modal?.hide();
              toast.success('Block updated!');
            }
          });
        }
      }}
    >
      {mode.mode === 'update' && (
        <input type="hidden" name="id" value={String(mode.id)} />
      )}

      <div className="flex flex-col gap-4">
        <h2 className="font-cal px-4 pt-4 text-2xl">{mode.title}</h2>

        <div className="relative">
          <div className={cn('bg-white px-4 pb-4 transition-all duration-300')}>
            <BlockPicker
              type={mode.type}
              data={data}
              setData={setData}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10">
        <BlockFormButton isLoading={false} />
      </div>
    </form>
  );
}
