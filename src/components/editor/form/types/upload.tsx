'use client';

import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { LuMove, LuTrash } from 'react-icons/lu';

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

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { cn, type Block as BlockType } from 'lib/utils';

type Media = {
  id: string;
  link?: string;
} & ({ kind: 'remote'; url: string } | { kind: 'local'; file: File });

export const UploaderItem = ({
  isActive,
  item,
  list,
  onDelete,
  onLinkChange
}: {
  isActive: boolean;
  item: Media;
  list: Media[];
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: Media['id']) => void;
  // eslint-disable-next-line no-unused-vars
  onLinkChange: (id: Media['id'], link: Media['link']) => void;
}) => {
  const [src, setSrc] = useState<string>(item.kind === 'local' ? '' : item.url);

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

  const itemFile = item.kind === 'local' ? item.file : null;
  useEffect(() => {
    return () => {
      if (itemFile) {
        const reader = new FileReader();
        reader.onloadend = () => setSrc(reader.result?.toString() || '');
        reader.readAsDataURL(itemFile);
      }
    };
  }, [itemFile]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2',
        isActive && 'p-1 shadow-sm border border-stone-300 rounded-md'
      )}
    >
      {list.length > 1 && (
        <div {...attributes} {...listeners} className="cursor-move">
          <LuMove />
        </div>
      )}

      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={item.id}
          className="w-14 aspect-square object-cover rounded-md"
        />
      </div>

      <div className="flex-1">
        <Input
          type="text"
          value={item.link}
          placeholder="Link"
          onChange={e => onLinkChange(item.id, e.target.value)}
        />
      </div>

      <div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(item.id)}
        >
          <LuTrash className="text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export const Uploader = forwardRef(
  ({
    setValue,
    ...props
  }: {
    name: string;
    shape: Extract<BlockType, { kind: 'upload' }>;
    data: Record<string, unknown>;
    setValue: (name: string, value: Media[]) => void; // eslint-disable-line no-unused-vars
  }) => {
    const isMultiple = props.shape.multiple;

    // biome-ignore lint/correctness/useExhaustiveDependencies: shut up
    const medias = useMemo(
      () => (props?.data?.[props.name] ?? []) as Media[],
      [name] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const [items, setItems] = useState(medias);
    const [activeId, setActiveId] = useState<string>();

    useEffect(() => {
      setItems(medias);
    }, [medias]);

    const sensors = useSensors(
      useSensor(MouseSensor, { activationConstraint: undefined }),
      useSensor(TouchSensor, { activationConstraint: undefined }),
      useSensor(KeyboardSensor)
    );

    const handleDragEnd = useCallback(
      ({ active, over }: DragEndEvent) => {
        setActiveId(undefined);

        if (active.id !== over?.id) {
          setItems(items => {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over?.id);

            const result = arrayMove(items, oldIndex, newIndex);

            setValue(props.name, result);

            return result;
          });
        }
      },
      [props.name, setValue]
    );

    const handleDragStart = useCallback(({ active }: DragStartEvent) => {
      setActiveId(active.id as string);
    }, []);

    const onDrop = useCallback(
      (files: File[]) => {
        if (files.length === 0) return;

        setItems(state => {
          const result = [
            ...(isMultiple ? state : []),
            ...files.map(file => ({
              id: nanoid(),
              kind: 'local' as const,
              file
            }))
          ];

          setValue(props.name, result);

          return result;
        });
      },
      [isMultiple, props.name, setValue]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple: props.shape.multiple,
      accept: props.shape.accept ?? {}
    });

    return (
      <div className="relative flex flex-col gap-5">
        <div
          className={cn(
            'flex flex-col cursor-pointer transition-all p-4 border-2 border-dashed',
            'border-slate-500 rounded-md text-slate-400 hover:border-slate-900 hover:text-slate-900',
            isDragActive && 'border-slate-900 text-slate-900'
          )}
        >
          <div {...getRootProps()} className="text-center">
            <input {...getInputProps({ ...props })} />

            {isDragActive ? (
              <>
                <p>Drop the files here</p>
                <p>Image or Video</p>
              </>
            ) : (
              <>
                <p>{"Drag 'n' drop some files here,"}</p>
                <p>or click to select files</p>
              </>
            )}
          </div>
        </div>

        {props.shape.preview === true && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {items?.map((item, index, list) => (
                  <UploaderItem
                    key={item.id}
                    isActive={activeId === item.id}
                    item={item}
                    list={list}
                    onLinkChange={(id, link) =>
                      setItems(items => {
                        const result = items.map(item =>
                          item.id === id ? { ...item, link } : item
                        );

                        setValue(props.name, result);

                        return result;
                      })
                    }
                    onDelete={id =>
                      setItems(items => {
                        const result = items.filter(item => item.id !== id);

                        setValue(props.name, result);

                        return result;
                      })
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    );
  }
);

Uploader.displayName = 'Uploader';
