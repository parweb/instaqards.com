'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block, Site } from '@prisma/client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import type { Font } from 'actions/google-fonts';
import DeleteBlockButton from 'components/delete-block-button';
import UpdateBlockModal from 'components/modal/update-block';
import UpdateBlockButton from 'components/update-block-button';
import { cn, generateCssProperties, type BlockStyle } from 'lib/utils';
import { LuMove } from 'react-icons/lu';
import { SocialIcon } from 'react-social-icons';

const BlockUpdate = ({ block, fonts }: { block: Block; fonts: Font[] }) => {
  return (
    <UpdateBlockButton>
      <UpdateBlockModal block={block} fonts={fonts} />
    </UpdateBlockButton>
  );
};

const BlockDelete = (block: Block) => {
  return <DeleteBlockButton {...block} />;
};

const BlockItem = ({ block, fonts }: { block: Block; fonts: Font[] }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const css = block.style as unknown as BlockStyle;

  if (block.type === 'main') {
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

        <div className="absolute right-10 flex gap-2 items-center p-2 transition-all opacity-0 group-hover:opacity-100 group-hover:right-0">
          <BlockUpdate block={block} fonts={fonts} />
          <BlockDelete {...block} />
        </div>
      </motion.div>
    );
  }

  if (block.type === 'spotify') {
    return (
      <div>
        <iframe
          title="Spotify"
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/album/3OxfaVgvTxUTy7276t7SPU"
          width="100%"
          height="352"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    );
  }

  if (block.type === 'tiktok') {
    return (
      <>
        <blockquote
          className="tiktok-embed"
          cite={`https://www.tiktok.com/@lemecencostard/video/${'7401431134904569120'}`}
          data-video-id={'7401431134904569120'}
          style={{ maxWidth: '605px', minWidth: '325px' }}
        >
          <section />
        </blockquote>
        <script async src="https://www.tiktok.com/embed.js" />
      </>
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
          <BlockUpdate block={block} fonts={fonts} />
          <BlockDelete {...block} />
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

        <div className="cursor-pointer">
          {block.logo?.includes('http') ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.logo ?? ''}
                alt={block.label}
                className={cn(
                  block.label === 'facebook' && 'h-[65px]',
                  block.label !== 'facebook' && 'h-[50px]',
                  'object-contain transition-all hover:scale-125'
                )}
              />
            </>
          ) : (
            <SocialIcon
              as="div"
              className={cn(
                block.label === 'facebook' && 'h-[65px]',
                block.label !== 'facebook' && 'h-[50px]',
                'object-contain transition-all hover:scale-125'
              )}
              url={block.href ?? ''}
            />
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
  fonts
}: {
  blocks: Block[];
  site: Site;
  type: 'main' | 'social';
  fonts: Font[];
}) => {
  const [items, setItems] = useState(blocks);

  useEffect(() => {
    setItems(blocks);
  }, [blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
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
              key={`BlockItem-${props.id}`}
              block={props}
              fonts={fonts}
            />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default BlockItem;
