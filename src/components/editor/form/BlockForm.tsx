'use client';

import type { Block } from '@prisma/client';
import { atomWithStorage } from 'jotai/utils';

import { BlockFormMain } from 'components/editor/form/BlockFormMain';
import { BlockFormSocial } from 'components/editor/form/BlockFormSocial';

export const $lastSelected = atomWithStorage<Block['widget'] | null>(
  'lastSelected',
  null
);

export function BlockForm({
  mode,
  initialData,
  initialWidget
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
  initialWidget: Block['widget'];
}) {
  return (
    <div className="bg-white w-full rounded-md md:max-w-md md:border md:border-stone-200 md:shadow overflow-hidden">
      {mode.type === 'main' && (
        <BlockFormMain
          mode={mode}
          initialData={initialData}
          initialWidget={initialWidget}
        />
      )}
      {mode.type === 'social' && (
        <BlockFormSocial mode={mode} initialData={initialData} />
      )}
    </div>
  );
}
