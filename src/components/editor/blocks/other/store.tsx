'use client';

import { EntityType, type Block, type Prisma } from '@prisma/client';
import { atom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash-es';
import { Suspense } from 'react';
import { z } from 'zod';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardTitle } from 'components/ui/card';

import {
  CategorySchema,
  InventorySchema,
  MediaSchema
} from '../../../../../prisma/generated/zod';
import { CarouselPictures } from 'components/ui/carousel';

export const input = z.object({});

const InventoriesSchema = z.array(
  InventorySchema.pick({
    id: true,
    name: true,
    basePrice: true,
    stock: true
  }).merge(
    z.object({
      category: CategorySchema.pick({
        name: true
      })
    })
  )
);

const MediasSchema = z.array(
  MediaSchema.pick({
    id: true,
    url: true,
    entityId: true,
    entityType: true
  })
);

const $inventories = atomFamily(
  (params: Prisma.InventoryFindManyArgs) =>
    atom(() =>
      fetch('/api/lake/inventory/findMany', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(data => InventoriesSchema.parse(data))
    ),
  isEqual
);

const $medias = atomFamily(
  (params: Prisma.MediaFindManyArgs) =>
    atom(() =>
      fetch('/api/lake/media/findMany', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(data => MediasSchema.parse(data))
    ),
  isEqual
);

const Inventory = ({
  inventory,
  medias
}: {
  inventory: z.infer<typeof InventoriesSchema>[number];
  medias: z.infer<typeof MediasSchema>;
}) => {
  return (
    <Card
      key={inventory.id}
      className="group overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="flex bg-gray-100">
        <CarouselPictures pictures={medias.map(picture => picture.url)} />
      </div>

      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <CardTitle className="mb-1 text-base">{inventory.name}</CardTitle>

          {inventory.basePrice && (
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">
                {Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(Number(inventory.basePrice))}
              </span>
            </div>
          )}
        </div>

        <div>
          <Button>BUY</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Inventories = ({ blockId }: { blockId: string }) => {
  const inventories = useAtomValue(
    $inventories({
      where: { blockId },
      select: {
        id: true,
        name: true,
        basePrice: true,
        stock: true,
        category: { select: { name: true } }
      }
    })
  );
  const medias = useAtomValue(
    $medias({
      where: {
        entityType: EntityType.INVENTORY,
        entityId: { in: inventories.map(inventory => inventory.id) }
      },
      select: {
        id: true,
        url: true,
        entityId: true,
        entityType: true
      }
    })
  );
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
      {inventories.map(inventory => (
        <Inventory
          key={inventory.id}
          inventory={inventory}
          medias={medias.filter(
            media =>
              media.entityId === inventory.id &&
              media.entityType === EntityType.INVENTORY
          )}
        />
      ))}
    </div>
  );
};

export default function Store({
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  return (
    <div>
      <Suspense fallback={null}>
        <Inventories blockId={block?.id ?? ''} />
      </Suspense>
    </div>
  );
}
