'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Prisma, Site } from '@prisma/client';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { memo, Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
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

const BlockUpdate = ({
  block
}: {
  block: Prisma.BlockGetPayload<{
    select: {
      id: true;
      type: true;
      label: true;
      href: true;
      logo: true;
      widget: true;
      siteId: true;
    };
  }>;
}) => {
  return (
    <UpdateBlockButton>
      <UpdateBlockModal block={block} />
    </UpdateBlockButton>
  );
};

const BlockDelete = ({
  block
}: {
  block: Prisma.BlockGetPayload<{ select: { id: true } }>;
}) => {
  return <DeleteBlockButton {...block} />;
};

const BlockDuplicate = ({
  block
}: {
  block: Prisma.BlockGetPayload<{ select: { id: true } }>;
}) => {
  return <DuplicateBlockButton {...block} />;
};

const BlockWidget = memo(
  ({
    block
  }: {
    block: Prisma.BlockGetPayload<{ select: { widget: true } }>;
  }) => {
    const widget = block.widget as unknown as {
      type: string;
      id: string;
      data: unknown;
    };

    const Component = dynamic(
      () => import(`components/editor/blocks/${widget.type}/${widget.id}.tsx`),
      { ssr: false }
    );

    return (
      <ErrorBoundary
        fallbackRender={({ error }) => (
          console.error(error), (<div>Something went wrong, sorry!</div>)
        )}
      >
        {/* @ts-ignore */}
        <Component {...(widget?.data ?? {})} block={block} />
      </ErrorBoundary>
    );
  }
);

BlockWidget.displayName = 'BlockWidget';

const BlockItem = ({
  block
}: {
  block: Prisma.BlockGetPayload<{
    select: {
      id: true;
      type: true;
      style: true;
      label: true;
      href: true;
      logo: true;
      widget: true;
      siteId: true;
    };
  }>;
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
        className="group relative flex flex-1 items-center gap-2"
        ref={setNodeRef}
        style={style}
      >
        <div
          {...attributes}
          {...listeners}
          className="absolute right-full pr-2"
        >
          <div className="cursor-move rounded-full bg-white p-2">
            <LuMove />
          </div>
        </div>

        {hasWidget === false && (
          <div
            className={cn(
              'cursor-pointer',
              'transition-all',
              'w-full rounded-md border border-white/90 p-3 text-center text-white/90',
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

        <div className="absolute left-3/4 flex flex-col items-center gap-2 p-2 opacity-0 transition-all duration-300 group-hover:left-full group-hover:opacity-100">
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
        className="group relative flex flex-1 flex-col items-center gap-2"
        ref={setNodeRef}
        style={style}
      >
        <div
          className={cn(
            'absolute bottom-[100%] flex items-center gap-2 p-2 text-sm',
            'opacity-0 transition-all duration-300 group-hover:opacity-100'
          )}
        >
          <BlockUpdate block={block} />
          <BlockDuplicate block={block} />
          <BlockDelete block={block} />
        </div>

        <div
          className={cn(
            'absolute top-[100%] flex items-center gap-2 p-2 text-sm',
            'opacity-0 transition-all duration-300 group-hover:opacity-100'
          )}
        >
          <div
            {...attributes}
            {...listeners}
            className="cursor-move rounded-full bg-white p-2"
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
            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-stone-200 p-1">
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
  type
}: {
  blocks: Prisma.BlockGetPayload<{
    select: {
      id: true;
      type: true;
      style: true;
      label: true;
      href: true;
      logo: true;
      widget: true;
      siteId: true;
    };
  }>[];
  site: Site;
  type: 'main' | 'social';
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
            <BlockItem key={`BlockItem-${props.id}`} block={props} />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default BlockItem;
