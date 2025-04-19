'use client';

import React, { useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useDroppable,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import isEqual from 'lodash/isEqual';

export interface KanbanProps<T> {
  /** Mapping of column ID to list of items */
  columns: Record<string, T[]>;
  /** Order of columns (their IDs) */
  statuses: string[];
  /** Human-readable labels for each column */
  statusLabels: Record<string, string>;
  /** Extract unique ID string for an item */
  getId(item: T): string;
  /** Render function for a card item */
  renderCard(item: T): React.ReactNode;
  /** Callback when a card is dragged and dropped */
  onDragEnd(params: {
    id: string;
    sourceStatus: string;
    destStatus: string;
    destIndex: number;
  }): void;
}

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
};

type DnDGroupProps = {
  id: string;
  items: string[];
  children: React.ReactNode;
};

const DnDGroup = React.memo(function DnDGroup({
  id,
  items,
  children
}: DnDGroupProps) {
  const { setNodeRef, isOver } = useDroppable({
    id
  });

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`bg-stone-50 dark:bg-stone-900 p-4 rounded-lg flex flex-col ${
          isOver ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        {children}
      </div>
    </SortableContext>
  );
});

interface SortableItemProps {
  id: string;
  isDragging: boolean;
  children: React.ReactNode;
}

const SortableItem = React.memo(function SortableItem({
  id,
  isDragging,
  children
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    cursor: 'grab'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
});

/**
 * Generic Kanban board (dumb/presentational), supports drag & drop via dnd-kit.
 */
export default function Kanban<T>({
  columns: initialColumns,
  statuses,
  statusLabels,
  getId,
  renderCard,
  onDragEnd
}: KanbanProps<T>) {
  const [columns, setColumns] = React.useState(initialColumns);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeData, setActiveData] = React.useState<T | null>(null);
  const previousColumns = React.useRef(initialColumns);

  // Mettre à jour les colonnes quand les props changent
  React.useEffect(() => {
    if (!isEqual(previousColumns.current, initialColumns)) {
      setColumns(initialColumns);
      previousColumns.current = initialColumns;
    }
  }, [initialColumns]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8
      }
    })
  );

  const findContainer = useCallback(
    (id: string) => {
      if (statuses.includes(id)) return id;
      return statuses.find(status =>
        columns[status]?.some(item => getId(item) === id)
      );
    },
    [columns, statuses, getId]
  );

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      setActiveId(active.id as string);
      const container = findContainer(active.id as string);
      if (container) {
        const item = columns[container].find(item => getId(item) === active.id);
        if (item) setActiveData(item);
      }
    },
    [columns, findContainer, getId]
  );

  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      if (!over) return;

      const activeContainer = findContainer(active.id as string);
      const overContainer = findContainer(over.id as string);

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        return;
      }

      const activeItems = columns[activeContainer] || [];
      const overItems = columns[overContainer] || [];

      let newIndex: number;

      // Si on dépose sur la colonne elle-même
      if (over.id === overContainer) {
        newIndex = overItems.length;
      } else {
        const overIndex = overItems.findIndex(item => getId(item) === over.id);
        newIndex = overIndex >= 0 ? overIndex : overItems.length;
      }

      // Mise à jour locale de l'état
      const updatedColumns = { ...columns };
      const movedItem = activeItems.find(item => getId(item) === active.id);

      if (movedItem) {
        // Retirer l'item de sa colonne d'origine
        updatedColumns[activeContainer] = activeItems.filter(
          item => getId(item) !== active.id
        );

        // Ajouter l'item dans sa nouvelle colonne
        const newColumnItems = [...overItems];
        newColumnItems.splice(newIndex, 0, movedItem);
        updatedColumns[overContainer] = newColumnItems;

        setColumns(updatedColumns);
        previousColumns.current = updatedColumns;
      }
    },
    [columns, findContainer, getId]
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over) {
        setActiveId(null);
        setActiveData(null);
        return;
      }

      const activeContainer = findContainer(active.id as string);
      const overContainer = findContainer(over.id as string);

      if (!activeContainer || !overContainer) {
        setActiveId(null);
        setActiveData(null);
        return;
      }

      const activeItems = columns[activeContainer];
      const overItems = columns[overContainer];

      let finalIndex: number;

      if (over.id === overContainer) {
        finalIndex = overItems.length;
      } else {
        const overIndex = overItems.findIndex(item => getId(item) === over.id);
        finalIndex = overIndex >= 0 ? overIndex : overItems.length;
      }

      // Appel API pour persister le changement
      onDragEnd({
        id: active.id as string,
        sourceStatus: activeContainer,
        destStatus: overContainer,
        destIndex: finalIndex
      });

      setActiveId(null);
      setActiveData(null);
    },
    [columns, findContainer, getId, onDragEnd]
  );

  const columnsItems = useMemo(
    () =>
      statuses.map(status => ({
        status,
        items: columns[status] || [],
        itemIds: (columns[status] || []).map(getId)
      })),
    [columns, statuses, getId]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columnsItems.map(({ status, items, itemIds }) => (
          <DnDGroup key={status} id={status} items={itemIds}>
            <h2 className="text-lg font-semibold dark:text-white mb-4">
              {statusLabels[status]}
            </h2>

            <div className="space-y-2 min-h-[50px]">
              {items.map(item => {
                const id = getId(item);
                return (
                  <SortableItem key={id} id={id} isDragging={id === activeId}>
                    {renderCard(item)}
                  </SortableItem>
                );
              })}
            </div>
          </DnDGroup>
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeId && activeData ? <div>{renderCard(activeData)}</div> : null}
      </DragOverlay>
    </DndContext>
  );
}
