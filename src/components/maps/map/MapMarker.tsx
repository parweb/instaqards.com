import type { SearchResult } from '../types';

export const getMarkerPosition = (
  selectedLocation: SearchResult | null
): { position: [number, number]; id: string } | undefined => {
  if (!selectedLocation) return undefined;

  return {
    position: [selectedLocation.lat, selectedLocation.lon],
    id: 'default',
  };
};
