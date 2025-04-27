import { z } from 'zod';

export const SearchResultSchema = z.array(
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

export type SearchResult = z.infer<typeof SearchResultSchema>;

export type Location = SearchResult[number];

export interface SearchInputProps {
  query: string;
  isOpen: boolean;
  isSearching: boolean;
  searchResults: SearchResult;
  // eslint-disable-next-line no-unused-vars
  onQueryChange: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onResultSelect: (result: Location) => void;
  // eslint-disable-next-line no-unused-vars
  onClearSearch: (e: React.MouseEvent) => void;
  isHandlingSelection: React.MutableRefObject<boolean>;
}

export interface MapSearchProps {
  // eslint-disable-next-line no-unused-vars
  onLocationSelect?: (location: Location) => void;
  className?: string;
}

export interface SearchInputFieldProps {
  query: string;
  isSearching: boolean;
  // eslint-disable-next-line no-unused-vars
  onQueryChange: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onClearSearch: (e: React.MouseEvent) => void;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export interface SearchResultsListProps {
  results: SearchResult;
  // eslint-disable-next-line no-unused-vars
  onSelect: (result: Location) => void;
}
