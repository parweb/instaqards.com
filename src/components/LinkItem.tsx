'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Link, Site } from '@prisma/client';
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
import DeleteLinkButton from 'components/delete-link-button';
import UpdateLinkModal from 'components/modal/update-link';
import UpdateLinkButton from 'components/update-link-button';
import { cn, generateCssProperties, type LinkStyle } from 'lib/utils';
import { LuMove } from 'react-icons/lu';
import { SocialIcon } from 'react-social-icons';

const LinkUpdate = ({ link, fonts }: { link: Link; fonts: Font[] }) => {
  return (
    <UpdateLinkButton>
      <UpdateLinkModal link={link} fonts={fonts} />
    </UpdateLinkButton>
  );
};

const LinkDelete = (link: Link) => {
  return <DeleteLinkButton {...link} />;
};

const LinkItem = ({ link, fonts }: { link: Link; fonts: Font[] }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const css = link.style as unknown as LinkStyle;

  if (link.type === 'main') {
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
          className="cursor-move p-2 bg-white rounded-full"
        >
          <LuMove />
        </div>

        <div
          className={cn(
            'cursor-pointer',
            'transition-all',
            'border border-white/90 rounded-md p-3 text-white/90 w-full text-center',
            'hover:bg-white hover:text-black'
          )}
        >
          {link.label}

          <style jsx>{`
            div {
              transition: all 0.3s ease;

              ${generateCssProperties(css.normal)}

              ${Object.keys(css || {})
                .filter(key => key !== 'normal')
                .map(
                  key => `
                    &:${key} {
                      ${generateCssProperties(css[key as keyof LinkStyle])}
                    }
                  `
                )}
            }
          `}</style>
        </div>

        <div className="absolute right-10 flex gap-2 items-center p-2 transition-all opacity-0 group-hover:opacity-100 group-hover:right-0">
          <LinkUpdate link={link} fonts={fonts} />
          <LinkDelete {...link} />
        </div>
      </motion.div>
    );
  }

  if (link.type === 'social') {
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
          <LinkUpdate link={link} fonts={fonts} />
          <LinkDelete {...link} />
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
          {link.logo?.includes('http') ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={link.logo ?? ''}
                alt={link.label}
                className={cn(
                  link.label === 'facebook' && 'h-[65px]',
                  link.label !== 'facebook' && 'h-[50px]',
                  'object-contain transition-all hover:scale-125'
                )}
              />
            </>
          ) : (
            <SocialIcon
              as="div"
              className={cn(
                link.label === 'facebook' && 'h-[65px]',
                link.label !== 'facebook' && 'h-[50px]',
                'object-contain transition-all hover:scale-125'
              )}
              url={link.href ?? ''}
            />
          )}
        </div>
      </div>
    );
  }

  return <></>;
};

export const LinkList = ({
  links,
  site,
  type,
  fonts
}: {
  links: Link[];
  site: Site;
  type: 'main' | 'social';
  fonts: Font[];
}) => {
  const [items, setItems] = useState(links);

  useEffect(() => {
    setItems(links);
  }, [links]);

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

        fetch('/api/link/update/positions', {
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
            <LinkItem key={`LinkItem-${props.id}`} link={props} fonts={fonts} />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default LinkItem;
