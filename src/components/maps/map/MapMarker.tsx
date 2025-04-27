import type { Location } from '../types';

export const getMarkerPosition = (
  selectedLocation: Location['geometry']['location'] | null
): { position: [number, number]; id: string } | undefined => {
  if (!selectedLocation) return undefined;

  return {
    position: [selectedLocation.lat, selectedLocation.lng],
    id: 'default'
  };
};
