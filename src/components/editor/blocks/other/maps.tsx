'use client';

import type { Block } from '@prisma/client';
import * as z from 'zod';

import MapContainer from 'components/maps/MapContainer';
import { json } from 'lib/utils';
import { SchemaAddress } from 'components/maps/services/google-maps';

const placeholder = {
  place_id: 'default',
  geometry: { location: { lat: 48.8566, lng: 2.3522 } },
  formatted_address: '10 Av. des Champs-Élysées, 75008 Paris, France',
  components: {
    street_number: '10',
    route: 'Avenue des Champs-Élysées',
    locality: 'Paris',
    political: 'France',
    administrative_area_level_2: 'Paris',
    administrative_area_level_1: 'Île-de-France',
    country: 'France',
    postal_code: '75008'
  }
};

export const input = z.object({
  label: z.string().describe(
    json({
      label: 'Label',
      kind: 'string'
    })
  ),
  position: z
    .object({
      place_id: z.string(),
      geometry: z.object({
        location: z.object({ lat: z.number(), lng: z.number() })
      }),
      components: SchemaAddress,
      formatted_address: z.string()
    })
    .describe(
      json({
        label: 'Address',
        kind: 'address',
        placeholder: 'Entrez une adresse',
        defaultValue: placeholder
      })
    )
});

export default function Maps({
  position = placeholder,
  label = 'Champs-Élysées'
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  const display_name = [
    position.components.street_number,
    position.components.route,
    position.components.postal_code,
    position.components.locality
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <MapContainer
      inputValue={{
        name: label,
        address: display_name
      }}
      mapPosition={[
        position.geometry.location.lat,
        position.geometry.location.lng
      ]}
      selected={{
        id: position.place_id,
        display_name,
        lat: position.geometry.location.lat,
        lng: position.geometry.location.lng
      }}
    />
  );
}
