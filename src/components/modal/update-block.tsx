'use client';

import type { Block, Site } from '@prisma/client';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { BlockFormButton } from 'components/editor/form/BlockFormButton';
import { BlockPicker } from 'components/editor/form/BlockPicker';
import { BlockPreview } from 'components/editor/form/BlockPreview';
import { motion } from 'framer-motion';
import { cn } from 'lib/utils';

export default function UpdateBlockModal({ block }: { block: Block }) {
  const params = useParams();

  const [data, setData] = useState({
    label: String(block.label),
    href: String(block.href),
    logo: String(block.logo)
  });

  const [selectedBlock, setSelectedBlock] = useState<Block['widget']>(
    block.widget
  );

  return (
    <div className="bg-white w-full rounded-md md:max-w-md md:border md:border-stone-200 md:shadow overflow-hidden">
      <div className="flex flex-col gap-4">
        <h2 className="font-cal text-2xl px-4 pt-4">Create a block</h2>

        <div className="relative">
          {selectedBlock !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <BlockPreview
                  id={block.id}
                  mode="update"
                  block={selectedBlock}
                  setSelectedBlock={setSelectedBlock}
                  siteId={params.id as Site['id']}
                  type={block.type}
                />
              </Suspense>
            </motion.div>
          )}

          <div
            className={cn('transition-all duration-300 bg-white px-4 pb-4', {
              '-translate-x-full pointer-events-none': selectedBlock !== null
            })}
          >
            <BlockPicker
              type={block.type}
              data={data}
              setData={setData}
              onClick={({ type, id }) => setSelectedBlock({ type, id })}
            />
          </div>
        </div>
      </div>

      {block.type === 'social' && (
        <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10">
          <BlockFormButton />
        </div>
      )}
    </div>
  );
}
