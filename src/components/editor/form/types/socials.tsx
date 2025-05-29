'use client';

import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Control, type FieldValues } from 'react-hook-form';
import { LuLink, LuMove, LuPlus, LuTrash } from 'react-icons/lu';
import { SocialIcon } from 'react-social-icons';
import { z } from 'zod';

import {
  closestCenter,
  DndContext,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';

import {
  restrictToVerticalAxis,
  restrictToWindowEdges
} from '@dnd-kit/modifiers';

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { input } from 'components/editor/blocks/social/simple';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { cn, type Block as BlockType } from 'lib/utils';

type Social = z.infer<typeof input>['socials'][number];

const SocialItem = ({
  isActive,
  item,
  list,
  onLinkChange,
  onDelete
}: {
  isActive: boolean;
  item: Social;
  list: Social[];
  // eslint-disable-next-line no-unused-vars
  onLinkChange: (link: Partial<Social>) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id, disabled: list.length < 2 });

  if (transform) {
    transform.scaleX = 1;
    transform.scaleY = 1;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex flex-1 items-center gap-2',
        isActive && 'rounded-md border border-stone-300 p-1 shadow-xs'
      )}
    >
      {list.length > 1 && (
        <div {...attributes} {...listeners} className="cursor-move">
          <LuMove />
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div>
            <input type="hidden" name="logo" value={item.logo} />

            {Boolean(item.logo) === true && item.href !== '' ? (
              <SocialIcon
                network={item.logo}
                fallback={{ color: '#000000', path: 'M0' }}
                style={{ width: 28, height: 28 }}
              />
            ) : (
              <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-stone-200 p-1">
                <LuLink />
              </div>
            )}
          </div>

          <Input
            id="href"
            name="href"
            type="text"
            placeholder="https://instagram.com/..."
            value={item.href}
            onChange={e => {
              onLinkChange({ id: item.id, href: e.target.value });

              try {
                const url = new URL(e.target.value);
                const domain = url.hostname.replace('www.', '');
                const logo = String(domain.split('.').at(0));

                onLinkChange({ id: item.id, logo });
              } catch (error) {
                console.error(error);
              }
            }}
            required
          />
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDelete(item.id)}
      >
        <LuTrash className="text-red-500" />
      </Button>
    </div>
  );
};

export const Socials = (props: {
  control: Control<FieldValues>;
  name: string;
  shape: Extract<BlockType, { kind: 'socials' }>;
  data: Record<string, unknown>;
  setValue: (name: string, value: Social[] | undefined) => void; // eslint-disable-line no-unused-vars
}) => {
  const socials = useMemo(
    () =>
      // @ts-ignore
      (props?.data?.[props.name] ?? []) as Social[],
    [props.name] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const [items, setItems] = useState(socials);
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    setItems(socials);
  }, [socials]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: undefined }),
    useSensor(TouchSensor, { activationConstraint: undefined }),
    useSensor(KeyboardSensor)
  );

  const name = props.name;
  const setValue = props.setValue;

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveId(undefined);

      if (active.id !== over?.id) {
        setItems(items => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over?.id);

          const result = arrayMove(items, oldIndex, newIndex);

          setValue(name, result);

          return result;
        });
      }
    },
    [name, setValue]
  );

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  }, []);

  return (
    <div className="flex flex-col items-stretch gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col items-stretch gap-2">
            {items?.map((link, _, list) => (
              <SocialItem
                key={link.id}
                isActive={activeId === link.id}
                item={link}
                list={list}
                onLinkChange={data => {
                  setItems(state => {
                    const result = state.map(old =>
                      old.id === data.id ? { ...old, ...data } : old
                    );

                    props.setValue(props.name, result);

                    return result;
                  });
                }}
                onDelete={id => {
                  setItems(state => {
                    const result = state.filter(old => old.id !== id);

                    props.setValue(
                      props.name,
                      result.length > 0 ? result : undefined
                    );

                    return result;
                  });
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div>
        <Button
          type="button"
          className="flex items-center gap-2"
          onClick={() => {
            setItems(state => {
              const result = [
                ...state,
                {
                  id: nanoid(),
                  href: '',
                  logo: ''
                }
              ];

              props.setValue(props.name, result);

              return result;
            });
          }}
        >
          <LuPlus />
          <span>Add</span>
        </Button>
      </div>
    </div>
  );
};
