'use client';

import type { Block, Site } from '@prisma/client';
import { useAtomValue } from 'jotai';
import { motion } from 'motion/react';
import { Suspense, useEffect, useState } from 'react';

import { $lastSelected } from 'components/editor/form/BlockForm';
import { BlockPicker } from 'components/editor/form/BlockPicker';
import { BlockPreview } from 'components/editor/form/BlockPreview';
import { cn } from 'lib/utils';
import { options } from 'settings';

export function BlockFormMain({
  mode,
  initialData,
  initialWidget,
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
  initialWidget: Block['widget'];
  siteId: Site['id'];
}) {
  const [data, setData] = useState(initialData);

  const lastSelected = useAtomValue($lastSelected);

  const [selectedBlock, setSelectedBlock] = useState<Block['widget']>(
    () => initialWidget
  );

  useEffect(() => {
    if (
      mode.mode === 'create' &&
      mode.type === 'main' &&
      options.dashboard.editor.saveLastSelectedBlock
    ) {
      setSelectedBlock(lastSelected);
    }
  }, [mode.mode, lastSelected, mode.type]);

  const isSelectedBlock =
    selectedBlock !== null &&
    (selectedBlock as { type: string | null }).type !== null &&
    (selectedBlock as { id: string | null }).id !== null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-cal px-4 pt-4 text-2xl">{mode.title}</h2>

      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn('absolute inset-0 transition-all duration-300', {
            invisible: isSelectedBlock === false
          })}
        >
          <Suspense fallback={null}>
            <BlockPreview
              {...mode}
              block={selectedBlock}
              setSelectedBlock={setSelectedBlock}
              siteId={siteId}
            />
          </Suspense>
        </motion.div>

        <div
          className={cn('bg-white px-4 pb-4 transition-all duration-300', {
            'pointer-events-none -translate-x-full': isSelectedBlock
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
  );
}
