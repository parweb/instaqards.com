import { useState, useCallback } from 'react';
import type { SearchResult } from 'components/maps/types';
import { formatDisplayName } from 'components/maps/services/nominatim';
import { toast } from 'sonner';

const DEFAULT_POSITION: [number, number] = [48.8566, 2.3522];
const SELECTION_RESET_DELAY = 300;

interface UseMapPositionProps {
  onLocationSelect?: (location: {
    display_name: string;
    lat: number;
    lon: number;
  }) => void;
}

export const useMapPosition = ({ onLocationSelect }: UseMapPositionProps) => {
  const [mapPosition, setMapPosition] = useState<[number, number]>(DEFAULT_POSITION);

  const handleSelectLocation = useCallback(
    (result: SearchResult) => {
      const displayNameShort = formatDisplayName(result.display_name);
      setMapPosition([result.lat, result.lon]);

      if (onLocationSelect) {
        onLocationSelect({
          display_name: result.display_name,
          lat: result.lat,
          lon: result.lon,
        });
      }

      toast.success('Location selected', {
        description: displayNameShort,
      });

      return new Promise<void>((resolve) => {
        setTimeout(resolve, SELECTION_RESET_DELAY);
      });
    },
    [onLocationSelect]
  );

  return {
    mapPosition,
    handleSelectLocation,
  };
}; 