'use client';

import type { Block, Prisma } from '@prisma/client';
import { atom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash-es';
import { Suspense } from 'react';
import { z } from 'zod';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardTitle } from 'components/ui/card';

import {
  CategorySchema,
  InventorySchema
} from '../../../../../prisma/generated/zod';

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

const Inventory = (props: z.infer<typeof InventoriesSchema>[number]) => {
  console.log({ props });

  return (
    <Card
      key={props.id}
      className="overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="flex h-48 items-center justify-center bg-gray-100">
        <span className="text-4xl text-gray-400">📷</span>
      </div>

      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <CardTitle className="mb-1 text-base">{props.name}</CardTitle>

          {props.basePrice && (
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">
                {Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(Number(props.basePrice))}
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
  return (
    <div className="flex flex-col gap-4">
      {inventories.map(inventory => (
        <Inventory key={inventory.id} {...inventory} />
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
