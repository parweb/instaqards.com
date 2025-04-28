import type { Location } from '../types';

export const getMarkerPosition = (
  selected: Location['geometry']['location'] | null
): { position: [number, number]; id: string } | undefined => {
  if (!selected) return undefined;

  return {
    position: [selected.lat, selected.lng],
    id: 'default'
  };
};
