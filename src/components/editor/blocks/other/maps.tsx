'use client';

import type { Block } from '@prisma/client';
import * as z from 'zod';

import MapContainer from 'components/maps/MapContainer';
import { json } from 'lib/utils';

export const input = z.object({
  position: z.tuple([z.number(), z.number()]).describe(
    json({
      kind: 'address',
      label: 'Adresse',
      placeholder: 'Entrez une adresse'
    })
  )
});

export default function Maps({
  position = [48.8566, 2.3522],
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  return (
    <>
      <MapContainer
        mapPosition={position}
        selectedLocation={{
          id: 'default',
          display_name: 'default',
          lat: position.at(0) ?? 0,
          lon: position.at(1) ?? 0
        }}
      />
    </>
  );
}
