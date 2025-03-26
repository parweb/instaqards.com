import type { SearchResult } from "components/maps/types";


const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export const searchPlaces = async (searchQuery: string): Promise<SearchResult[]> => {
  const params = new URLSearchParams({
    q: searchQuery,
    format: 'json',
    limit: '5',
    addressdetails: '1',
  });

  const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Nominatim API error: ${response.statusText}`);
  }

  return response.json();
};

export const formatDisplayName = (displayName: string): string => {
  return displayName.split(', ').slice(0, 2).join(', ');
}; 