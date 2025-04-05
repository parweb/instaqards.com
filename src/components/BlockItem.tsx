'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block, Site } from '@prisma/client';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { LuLink, LuMove } from 'react-icons/lu';
import { SocialIcon } from 'react-social-icons';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';

import {
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
  restrictToWindowEdges
} from '@dnd-kit/modifiers';

import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import DeleteBlockButton from 'components/delete-block-button';
import DuplicateBlockButton from 'components/duplicate-block-button';
import UpdateBlockModal from 'components/modal/update-block';
import UpdateBlockButton from 'components/update-block-button';
import { cn, generateCssProperties, type BlockStyle } from 'lib/utils';

const BlockWidget = dynamic(() => import('./BlockWidget'), { ssr: false });

const BlockUpdate = ({ block }: { block: Block }) => {
  return (
    <UpdateBlockButton>
      <UpdateBlockModal block={block} />
    </UpdateBlockButton>
  );
};

const BlockDelete = ({ block }: { block: Block }) => {
  return <DeleteBlockButton {...block} />;
};

const BlockDuplicate = ({ block }: { block: Block }) => {
  return <DuplicateBlockButton {...block} />;
};

const BlockItem = ({
  block,
  editor = false
}: {
  block: Block;
  editor?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  if (transform) {
    transform.scaleX = 1;
    transform.scaleY = 1;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const css = block.style as unknown as BlockStyle;

  if (block.type === 'main') {
    const hasWidget = !(
      Boolean(block?.widget) === false ||
      Object.keys(block?.widget ?? {}).length === 0
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="group flex flex-1 items-center gap-2 relative"
        ref={setNodeRef}
        style={style}
      >
        <div
          {...attributes}
          {...listeners}
          className="absolute right-full pr-2"
        >
          <div className="cursor-move p-2 bg-white rounded-full">
            <LuMove />
          </div>
        </div>

        {hasWidget === false && (
          <div
            className={cn(
              'cursor-pointer',
              'transition-all',
              'border border-white/90 rounded-md p-3 text-white/90 w-full text-center',
              'hover:bg-white hover:text-black'
            )}
          >
            {block.label}

            <style jsx>{`
              div {
                transition: all 0.3s ease;

                ${generateCssProperties(css.normal)}

                ${Object.keys(css || {})
                  .filter(key => key !== 'normal')
                  .map(
                    key => `
                    &:${key} {
                      ${generateCssProperties(css[key as keyof BlockStyle])}
                    }
                  `
                  )}
              }
            `}</style>
          </div>
        )}

        {hasWidget === true && (
          <Suspense fallback={null}>
            <BlockWidget block={block} />
          </Suspense>
        )}

        <div
          className={cn(
            'absolute left-3/4 z-50 flex flex-col items-center gap-2 p-2 opacity-0 transition-all duration-300 group-hover:left-full group-hover:opacity-100',
            editor === true && 'opacity-100 left-full'
          )}
        >
          <BlockUpdate block={block} />
          <BlockDuplicate block={block} />
          <BlockDelete block={block} />
        </div>
      </motion.div>
    );
  }

  if (block.type === 'social') {
    return (
      <div
        className="group flex flex-col flex-1 items-center gap-2 relative"
        ref={setNodeRef}
        style={style}
      >
        <div
          className={cn(
            'flex gap-2 absolute items-center p-2 bottom-[100%] text-sm',
            'transition-all duration-300 opacity-0 group-hover:opacity-100 '
          )}
        >
          <BlockUpdate block={block} />
          <BlockDuplicate block={block} />
          <BlockDelete block={block} />
        </div>

        <div
          className={cn(
            'flex gap-2 absolute items-center p-2 top-[100%] text-sm',
            'transition-all duration-300 opacity-0 group-hover:opacity-100 '
          )}
        >
          <div
            {...attributes}
            {...listeners}
            className="cursor-move p-2 bg-white rounded-full"
          >
            <LuMove />
          </div>
        </div>

        <div className="cursor-pointer transition-all hover:scale-125">
          {block.logo?.includes('http') ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.logo ?? ''}
                alt={block.label ?? ''}
                className={cn(
                  block.label === 'facebook' && 'h-[65px]',
                  block.label !== 'facebook' && 'h-[50px]',
                  'object-contain'
                )}
              />
            </>
          ) : Boolean(block.logo) === true ? (
            <SocialIcon
              as="div"
              network={block.logo ?? undefined}
              className={cn(
                block.label === 'facebook' && 'h-[65px]',
                block.label !== 'facebook' && 'h-[50px]',
                'object-contain'
              )}
              url={block.href ?? ''}
            />
          ) : (
            <div className="p-1 w-[50px] h-[50px] flex items-center justify-center bg-stone-200 rounded-full">
              <LuLink />
            </div>
          )}
        </div>
      </div>
    );
  }

  return <></>;
};

export const BlockList = ({
  blocks,
  site,
  type,
  editor = false
}: {
  blocks: Block[];
  site: Site;
  type: 'main' | 'social';
  editor?: boolean;
}) => {
  const [items, setItems] = useState(blocks);

  useEffect(() => {
    setItems(blocks);
  }, [blocks]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: undefined }),
    useSensor(TouchSensor, { activationConstraint: undefined }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);

        const result = arrayMove(items, oldIndex, newIndex);

        fetch('/api/block/update/positions', {
          method: 'POST',
          body: JSON.stringify({ result, site })
        });

        return result;
      });
    }
  };

  const fontsNeeded = items
    .flatMap(({ style }) =>
      Object.values(style as Record<string, { fontFamily: string }>).flatMap(
        css => css.fontFamily
      )
    )
    .filter(Boolean) as string[];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?${fontsNeeded
          .map(font => `family=${font.replaceAll(' ', '+')}&display=swap`)
          .join('&')}&display=swap');
      `}</style>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[
          type === 'main' ? restrictToVerticalAxis : restrictToHorizontalAxis,
          restrictToWindowEdges
        ]}
      >
        <SortableContext
          items={items}
          strategy={
            type === 'main'
              ? verticalListSortingStrategy
              : horizontalListSortingStrategy
          }
        >
          {items.map(props => (
            <BlockItem
              editor={editor}
              key={`BlockItem-${props.id}`}
              block={props}
            />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default BlockItem;
