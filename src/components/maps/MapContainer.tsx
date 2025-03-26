import { useMemo } from 'react';
import MapView from './map/MapView';
import { getMarkerPosition } from './map/MapMarker';
import type { SearchResult } from './types';
import React from 'react';

interface MapContainerProps {
  selectedLocation: SearchResult | null;
  mapPosition: [number, number];
}

const MapContainer = ({ selectedLocation, mapPosition }: MapContainerProps) => {
  const markerPosition = useMemo(
    () => getMarkerPosition(selectedLocation),
    [selectedLocation]
  );

  return (
    <div className='w-full aspect-video relative overflow-hidden rounded-lg transition-all'>
      <MapView
        position={mapPosition}
        markers={[markerPosition].filter(Boolean)}
      />
    </div>
  );
};

export default React.memo(MapContainer);
