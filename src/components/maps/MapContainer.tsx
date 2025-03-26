'use client';

import { Suspense, useMemo } from 'react';
// import MapView from './map/MapView';
import { getMarkerPosition } from './map/MapMarker';
import type { SearchResult } from './types';
import React from 'react';
import Yolo from './map/Yolo';

interface MapContainerProps {
  selectedLocation: SearchResult | null;
  mapPosition: [number, number];
}

const MapContainer = ({ selectedLocation, mapPosition }: MapContainerProps) => {
  // Memoize marker position calculation to prevent unnecessary re-renders
  const markerPosition = useMemo(
    () => getMarkerPosition(selectedLocation),
    [selectedLocation]
  );

  // Memoize markers array to prevent unnecessary re-renders
  const markers = useMemo(
    () => (markerPosition ? [markerPosition] : []),
    [markerPosition]
  );

  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-lg transition-all">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            Loading...
          </div>
        }
      >
        <Yolo position={mapPosition} markers={markers} />
      </Suspense>
    </div>
  );
};

export default React.memo(MapContainer);
