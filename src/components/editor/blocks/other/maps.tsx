'use client';

import type { Block } from '@prisma/client';
import * as z from 'zod';

import MapContainer from 'components/maps/MapContainer';
import { json } from 'lib/utils';

export const input = z.object({
  label: z.string().describe(
    json({
      label: 'Label',
      kind: 'string'
    })
  ),
  position: z
    .object({
      lat: z.number(),
      lon: z.number(),
      display_name: z.string(),
      address: z.object({
        house_number: z.string(),
        road: z.string(),
        postcode: z.string(),
        municipality: z.string()
      })
    })
    .describe(
      json({
        kind: 'address',
        label: 'Adresse',
        placeholder: 'Entrez une adresse'
      })
    )
});

export default function Maps({
  position = {
    lat: 48.8566,
    lon: 2.3522,
    display_name: 'Paris',
    address: {
      house_number: '1',
      road: 'rue de la paix',
      postcode: '75000',
      municipality: 'Paris'
    }
  },
  label = 'Nom du lieu'
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  const display_name = [
    position.address.house_number,
    position.address.road,
    position.address.postcode,
    position.address.municipality
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <MapContainer
      inputValue={{
        name: label,
        address: display_name
      }}
      mapPosition={[position.lat, position.lon]}
      selectedLocation={{
        id: 'default',
        display_name: display_name,
        lat: position.lat,
        lon: position.lon
      }}
    />
  );
}
