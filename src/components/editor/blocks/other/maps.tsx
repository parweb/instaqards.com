'use client';

import type { Block } from '@prisma/client';
import * as z from 'zod';

import MapSearch from 'components/maps/MapSearch';

export const input = z.object({});

export default function Maps({
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  return (
    <MapSearch
      onLocationSelect={location => {
        console.log('Selected location:', location);
      }}
    />
  );
}
