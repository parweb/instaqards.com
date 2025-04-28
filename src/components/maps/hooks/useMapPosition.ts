import { useCallback, useState } from 'react';

import type { Location } from 'components/maps/types';

const DEFAULT_POSITION: [number, number] = [48.8566, 2.3522];
const SELECTION_RESET_DELAY = 150;

interface UseMapPositionProps {
  // eslint-disable-next-line no-unused-vars
  onLocationSelect?: (location: Location) => void;
}

export const useMapPosition = ({ onLocationSelect }: UseMapPositionProps) => {
  const [mapPosition, setMapPosition] =
    useState<[number, number]>(DEFAULT_POSITION);

  const handleSelectLocation = useCallback(
    (result: Location) => {
      setMapPosition([
        result.geometry.location.lat,
        result.geometry.location.lng
      ]);

      if (onLocationSelect) {
        setTimeout(() => {
          onLocationSelect(result);
        }, 0);
      }

      return new Promise<void>(resolve => {
        setTimeout(resolve, SELECTION_RESET_DELAY);
      });
    },
    [onLocationSelect]
  );

  return {
    mapPosition,
    handleSelectLocation
  };
};
