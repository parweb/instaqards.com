import { z } from 'zod';

const Schemafeature = z.union([
  z.object({
    id: z.string().optional(),
    type: z.string(),
    geometry: z.object({
      type: z.string(),
      coordinates: z.array(z.number())
    }),
    properties: z.object({
      id: z.string().optional(),
      label: z.string(),
      score: z.number(),
      housenumber: z.string(),
      name: z.string(),
      postcode: z.string(),
      citycode: z.string(),
      x: z.number(),
      y: z.number(),
      city: z.string(),
      context: z.string(),
      type: z.string(),
      importance: z.number(),
      street: z.string(),
      _type: z.string()
    })
  }),
  z.object({
    id: z.string().optional(),
    type: z.string(),
    geometry: z.object({
      type: z.string(),
      coordinates: z.array(z.number())
    }),
    properties: z.object({
      id: z.string().optional(),
      label: z.string(),
      score: z.number(),
      housenumber: z.string(),
      banId: z.string(),
      name: z.string(),
      postcode: z.string(),
      citycode: z.string(),
      x: z.number(),
      y: z.number(),
      city: z.string(),
      context: z.string(),
      type: z.string(),
      importance: z.number(),
      street: z.string(),
      _type: z.string()
    })
  })
]);

export type Feature = z.infer<typeof Schemafeature>;

export const SchemaAdresseGouv = z.object({
  type: z.string(),
  features: z.array(Schemafeature)
});

const SERVICE_URL = 'https://api-adresse.data.gouv.fr/search';

export const searchPlaces = async (
  searchQuery: string,
  signal: AbortSignal
) => {
  const params = new URLSearchParams({
    q: searchQuery,
    limit: '5'
  });

  const response = await fetch(`${SERVICE_URL}?${params.toString()}`, {
    signal
  });

  if (!response.ok) {
    throw new Error(`Address API error: ${response.statusText}`);
  }

  return SchemaAdresseGouv.parse(await response.json());
};

export const formatDisplayName = (displayName: string): string => {
  return displayName.split(', ').slice(0, 2).join(', ');
};
