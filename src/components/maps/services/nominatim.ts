import { z } from 'zod';

const SearchResultSchema = z.array(
  z.union([
    z.object({
      id: z.string().optional(),
      place_id: z.number(),
      licence: z.string(),
      osm_type: z.string(),
      osm_id: z.number(),
      lat: z.string().transform(val => parseFloat(val)),
      lon: z.string().transform(val => parseFloat(val)),
      class: z.string(),
      type: z.string(),
      place_rank: z.number(),
      importance: z.number(),
      addresstype: z.string(),
      name: z.string(),
      display_name: z.string(),
      address: z.object({
        amenity: z.string().optional(),
        municipality: z.string().optional(),
        house_number: z.string().optional(),
        road: z.string().optional(),
        village: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        state: z.string().optional(),
        'ISO3166-2-lvl6': z.string().optional(),
        region: z.string().optional(),
        'ISO3166-2-lvl4': z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().optional(),
        country_code: z.string().optional()
      }),
      boundingbox: z.array(z.string())
    }),
    z.object({
      id: z.string().optional(),
      place_id: z.number(),
      licence: z.string(),
      osm_type: z.string(),
      osm_id: z.number(),
      lat: z.string().transform(val => parseFloat(val)),
      lon: z.string().transform(val => parseFloat(val)),
      class: z.string(),
      type: z.string(),
      place_rank: z.number(),
      importance: z.number(),
      addresstype: z.string(),
      name: z.string(),
      display_name: z.string(),
      address: z.object({
        amenity: z.string().optional(),
        municipality: z.string().optional(),
        house_number: z.string().optional(),
        road: z.string().optional(),
        city_block: z.string().optional(),
        suburb: z.string().optional(),
        city_district: z.string().optional(),
        city: z.string().optional(),
        'ISO3166-2-lvl6': z.string().optional(),
        region: z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().optional(),
        country_code: z.string().optional()
      }),
      boundingbox: z.array(z.string())
    }),
    z.object({
      id: z.string().optional(),
      place_id: z.number(),
      licence: z.string(),
      osm_type: z.string(),
      osm_id: z.number(),
      lat: z.string().transform(val => parseFloat(val)),
      lon: z.string().transform(val => parseFloat(val)),
      class: z.string(),
      type: z.string(),
      place_rank: z.number(),
      importance: z.number(),
      addresstype: z.string(),
      name: z.string(),
      display_name: z.string(),
      address: z.object({
        amenity: z.string().optional(),
        municipality: z.string().optional(),
        house_number: z.string().optional(),
        road: z.string().optional(),
        neighbourhood: z.string().optional(),
        suburb: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        region: z.string().optional(),
        state: z.string().optional(),
        'ISO3166-2-lvl4': z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().optional(),
        country_code: z.string().optional()
      }),
      boundingbox: z.array(z.string())
    }),
    z.object({
      id: z.string().optional(),
      place_id: z.number(),
      licence: z.string(),
      osm_type: z.string(),
      osm_id: z.number(),
      lat: z.string().transform(val => parseFloat(val)),
      lon: z.string().transform(val => parseFloat(val)),
      class: z.string(),
      type: z.string(),
      place_rank: z.number(),
      importance: z.number(),
      addresstype: z.string(),
      name: z.string(),
      display_name: z.string(),
      address: z.object({
        municipality: z.string().optional(),
        house_number: z.string().optional(),
        road: z.string().optional(),
        town: z.string().optional(),
        state: z.string().optional(),
        'ISO3166-2-lvl4': z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().optional(),
        country_code: z.string().optional()
      }),
      boundingbox: z.array(z.string())
    }),
    z.object({
      id: z.string().optional(),
      place_id: z.number(),
      licence: z.string(),
      osm_type: z.string(),
      osm_id: z.number(),
      lat: z.string().transform(val => parseFloat(val)),
      lon: z.string().transform(val => parseFloat(val)),
      class: z.string(),
      type: z.string(),
      place_rank: z.number(),
      importance: z.number(),
      addresstype: z.string(),
      name: z.string(),
      display_name: z.string(),
      address: z.object({
        municipality: z.string().optional(),
        house_number: z.string().optional(),
        road: z.string().optional(),
        neighbourhood: z.string().optional(),
        city_district: z.string().optional(),
        town: z.string().optional(),
        county: z.string().optional(),
        region: z.string().optional(),
        'ISO3166-2-lvl4': z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().optional(),
        country_code: z.string().optional()
      }),
      boundingbox: z.array(z.string())
    })
  ])
);

const SERVICE_URL = 'https://nominatim.openstreetmap.org/search';

export const searchPlaces = async (
  searchQuery: string,
  signal: AbortSignal
) => {
  const params = new URLSearchParams({
    q: searchQuery,
    format: 'json',
    limit: '5',
    addressdetails: '1'
  });

  const response = await fetch(`${SERVICE_URL}?${params.toString()}`, {
    signal
  });

  if (!response.ok) {
    throw new Error(`Nominatim API error: ${response.statusText}`);
  }

  return SearchResultSchema.parse(await response.json());
};

export const formatDisplayName = (displayName: string): string => {
  return displayName.split(', ').slice(0, 2).join(', ');
};
