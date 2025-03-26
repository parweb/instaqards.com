import type { SearchResult } from 'components/maps/types';
import { useCallback, useState } from 'react';

const DEFAULT_POSITION: [number, number] = [48.8566, 2.3522];
const SELECTION_RESET_DELAY = 150;

interface UseMapPositionProps {
  onLocationSelect?: (location: {
    display_name: string;
    lat: number;
    lon: number;
  }) => void;
}

export const useMapPosition = ({ onLocationSelect }: UseMapPositionProps) => {
  const [mapPosition, setMapPosition] =
    useState<[number, number]>(DEFAULT_POSITION);

  const handleSelectLocation = useCallback(
    (result: SearchResult) => {
      setMapPosition([result.lat, result.lon]);

      if (onLocationSelect) {
        const locationData = {
          display_name: result.display_name,
          lat: result.lat,
          lon: result.lon
        };

        setTimeout(() => {
          onLocationSelect(locationData);
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
