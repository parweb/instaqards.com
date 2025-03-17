'use client';

import type { Block, Site } from '@prisma/client';
import { motion } from 'motion/react';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { BlockFormButton } from 'components/editor/form/BlockFormButton';
import { BlockPicker } from 'components/editor/form/BlockPicker';
import { BlockPreview } from 'components/editor/form/BlockPreview';
import { cn } from 'lib/utils';

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
  const params = useParams();

  const [data, setData] = useState(initialData);

  const [selectedBlock, setSelectedBlock] =
    useState<Block['widget']>(initialWidget);

  const isSelectedBlock =
    selectedBlock !== null &&
    (selectedBlock as { type: string | null }).type !== null &&
    (selectedBlock as { id: string | null }).id !== null;

  return (
    <div className="bg-white w-full rounded-md md:max-w-md md:border md:border-stone-200 md:shadow overflow-hidden">
      <div className="flex flex-col gap-4">
        <h2 className="font-cal text-2xl px-4 pt-4">{mode.title}</h2>

        <div className="relative">
          {isSelectedBlock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <BlockPreview
                  {...mode}
                  block={selectedBlock}
                  setSelectedBlock={setSelectedBlock}
                  siteId={params.id as Site['id']}
                />
              </Suspense>
            </motion.div>
          )}

          <div
            className={cn('transition-all duration-300 bg-white px-4 pb-4', {
              '-translate-x-full pointer-events-none': isSelectedBlock
            })}
          >
            <BlockPicker
              type={mode.type}
              data={data}
              setData={setData}
              onClick={({ type, id }) =>
                setSelectedBlock(state => ({
                  // @ts-ignore
                  ...state,
                  type,
                  id
                }))
              }
            />
          </div>
        </div>
      </div>

      {mode.type === 'social' && (
        <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10">
          <BlockFormButton />
        </div>
      )}
    </div>
  );
}
