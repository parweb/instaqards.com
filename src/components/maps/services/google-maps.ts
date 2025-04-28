import { z } from 'zod';

export const SchemaAddress = z.object({
  street_number: z.string().optional(),
  route: z.string().optional(),
  locality: z.string().optional(),
  political: z.string().optional(),
  administrative_area_level_2: z.string().optional(),
  administrative_area_level_1: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional()
});

const SchemaItem = z.object({
  components: SchemaAddress,
  address_components: z.array(
    z.object({
      long_name: z.string(),
      short_name: z.string(),
      types: z.array(z.string())
    })
  ),
  formatted_address: z.string(),
  geometry: z.object({
    bounds: z
      .object({
        northeast: z.object({ lat: z.number(), lng: z.number() }),
        southwest: z.object({ lat: z.number(), lng: z.number() })
      })
      .optional(),
    location: z.object({ lat: z.number(), lng: z.number() }),
    location_type: z.string(),
    viewport: z.object({
      northeast: z.object({ lat: z.number(), lng: z.number() }),
      southwest: z.object({ lat: z.number(), lng: z.number() })
    })
  }),
  navigation_points: z
    .array(
      z.object({
        location: z.object({ latitude: z.number(), longitude: z.number() })
      })
    )
    .optional(),
  place_id: z.string(),
  types: z.array(z.string())
});

const SchemaResult = z.object({
  results: z.array(SchemaItem),
  status: z.string()
});

export type Item = z.infer<typeof SchemaItem>;

const SERVICE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export const searchPlaces = async (
  searchQuery: string,
  signal: AbortSignal
) => {
  const params = new URLSearchParams({
    key: String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
    address: searchQuery
  });

  const response = await fetch(`${SERVICE_URL}?${params.toString()}`, {
    signal
  });

  if (!response.ok) {
    throw new Error(`Address API error: ${response.statusText}`);
  }

  return SchemaResult.parse(
    await response.json().then(data => ({
      ...data,
      // @ts-ignore
      results: data.results.map(result => ({
        ...result,
        components: Object.fromEntries(
          // @ts-ignore
          result.address_components.flatMap(component =>
            // @ts-ignore
            component.types.map(type => [type, component.long_name])
          )
        )
      }))
    }))
  );
};

export const formatDisplayName = (displayName: string): string => {
  return displayName.split(', ').slice(0, 2).join(', ');
};
