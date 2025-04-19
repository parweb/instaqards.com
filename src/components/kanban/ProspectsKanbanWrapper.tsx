'use client';

import { Prospect } from '@prisma/client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { toast } from 'sonner';

import { useModal } from 'components/modal/provider';
import { formatPhoneNumber } from 'helpers/formatPhoneNumber';
import Kanban from './Kanban';
import ProspectDetail from './ProspectDetail';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from 'components/ui/card';

export interface ProspectsKanbanWrapperProps {
  initialColumns: Record<string, Prospect[]>;
  statuses: string[];
  statusLabels: Record<string, string>;
}

/**
 * Smart wrapper for Prospect Kanban, handles state and API updates.
 */
export default function ProspectsKanbanWrapper({
  initialColumns,
  statuses,
  statusLabels
}: ProspectsKanbanWrapperProps) {
  const [columns, setColumns] = React.useState(initialColumns);
  const isUpdatingRef = useRef(false);
  const previousColumnsRef = useRef(initialColumns);

  const modal = useModal();

  useEffect(() => {
    if (JSON.stringify(initialColumns) !== JSON.stringify(columns)) {
      setColumns(initialColumns);
      previousColumnsRef.current = initialColumns;
    }
  }, [initialColumns]);

  const updateProspect = useCallback(
    async (
      id: string,
      status: string,
      position: number
    ): Promise<Prospect | null> => {
      try {
        const response = await fetch('/api/prospect/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status, position })
        });

        if (!response.ok) {
          throw new Error('Failed to update prospect');
        }

        // Fetch the updated prospect data
        const prospectResponse = await fetch(`/api/prospect/${id}`);
        if (!prospectResponse.ok) {
          throw new Error('Failed to fetch updated prospect');
        }

        const updatedProspect = await prospectResponse.json();
        return updatedProspect;
      } catch (error) {
        console.error('Failed to update prospect:', error);
        return null;
      }
    },
    []
  );

  const handleDragEnd = useCallback(
    async ({
      id,
      destStatus,
      destIndex
    }: {
      id: string;
      sourceStatus: string;
      destStatus: string;
      destIndex: number;
    }) => {
      if (isUpdatingRef.current) {
        console.log('Update already in progress, skipping...');
        return;
      }
      isUpdatingRef.current = true;

      try {
        // Create deep copies to avoid reference issues
        const newColumns = JSON.parse(JSON.stringify(columns));
        let movedItem: Prospect | undefined;

        // Find and remove the item from all columns
        for (const status of statuses) {
          const items = newColumns[status] || [];
          const itemIndex = items.findIndex((item: Prospect) => item.id === id);
          if (itemIndex !== -1) {
            [movedItem] = items.splice(itemIndex, 1);
            newColumns[status] = items;
          }
        }

        if (!movedItem) {
          throw new Error('Item not found in any column');
        }

        // Update item status and position
        movedItem.status = destStatus;

        // Add item to destination column
        const destItems = newColumns[destStatus] || [];
        destItems.splice(destIndex, 0, movedItem);
        newColumns[destStatus] = destItems;

        // Optimistic update
        setColumns(newColumns);
        previousColumnsRef.current = newColumns;

        // API call
        const updatedProspect = await updateProspect(id, destStatus, destIndex);

        if (!updatedProspect) {
          throw new Error('Failed to update prospect');
        }

        // Update the columns with the fresh data
        const finalColumns = JSON.parse(JSON.stringify(newColumns));
        const destItemsIndex = finalColumns[destStatus].findIndex(
          (item: Prospect) => item.id === id
        );
        if (destItemsIndex !== -1) {
          finalColumns[destStatus][destItemsIndex] = updatedProspect;
        }
        setColumns(finalColumns);
        previousColumnsRef.current = finalColumns;

        toast.success('Prospect mis à jour');
      } catch (error) {
        console.error('Failed to update prospect:', error);
        // Restore previous state
        setColumns(previousColumnsRef.current);
        toast.error('Erreur lors de la mise à jour du prospect');
      } finally {
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 500); // Add a small delay before allowing next update
      }
    },
    [columns, statuses, updateProspect]
  );

  const items = useMemo(() => {
    return Object.fromEntries(
      Object.values(columns)
        .flat()
        .map(item => [item.id, item])
    );
  }, [columns]);

  const showDetails = useCallback(
    (id: Prospect['id']) => {
      const prospect = items[id];
      if (prospect) {
        modal?.show(<ProspectDetail {...prospect} />);
      }
    },
    [modal, items]
  );

  return (
    <div className="flex flex-col space-y-6">
      <Kanban
        columns={columns}
        statuses={statuses}
        statusLabels={statusLabels}
        getId={item => item.id}
        renderCard={item => {
          return (
            <Card
              onClick={() => showDetails(item.id)}
              className="w-full hover:shadow-md transition-shadow "
            >
              <CardHeader className="p-4 flex flex-col gap-4">
                <CardTitle
                  title={item.raison_sociale ?? 'ø'}
                  className="text-balance"
                >
                  {item.raison_sociale ?? 'ø'}
                </CardTitle>

                <div className="flex flex-col gap-2">
                  <CardDescription
                    title={
                      item.ville || item.cp
                        ? `${item.ville} ${item.cp ? `(${item.cp})` : 'ø'}`
                        : 'ø'
                    }
                    className="flex gap-2 items-center"
                  >
                    <LuMapPin />
                    <span className="text-balance">
                      {item.ville || item.cp ? (
                        <>
                          {item.ville}
                          {item.cp ? ` (${item.cp})` : ''}
                        </>
                      ) : (
                        'ø'
                      )}
                    </span>
                  </CardDescription>

                  <CardDescription
                    title={item.tel ? formatPhoneNumber(item.tel) : 'ø'}
                    className="flex gap-2 items-center"
                  >
                    <LuPhone />
                    <span className="truncate">
                      {item.tel ? formatPhoneNumber(item.tel) : 'ø'}
                    </span>
                  </CardDescription>

                  <CardDescription
                    title={item.email ?? 'ø'}
                    className="flex gap-2 items-center"
                  >
                    <LuMail />
                    <span className="truncate">{item.email ?? 'ø'}</span>
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        }}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
}
