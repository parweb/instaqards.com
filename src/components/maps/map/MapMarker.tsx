import type { Location } from '../types';

export const getMarkerPosition = (
  selectedLocation: Pick<Location, 'lat' | 'lon'> | null
): { position: [number, number]; id: string } | undefined => {
  if (!selectedLocation) return undefined;

  return {
    position: [selectedLocation.lat, selectedLocation.lon],
    id: 'default'
  };
};
