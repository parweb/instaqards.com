'use client';

import { Suspense, useMemo } from 'react';
// import MapView from './map/MapView';
import { getMarkerPosition } from './map/MapMarker';
import type { SearchResult } from './types';
import React from 'react';
import Yolo from './map/Yolo';
import { cn } from 'lib/utils';
import { cal, inter, open } from 'styles/fonts';

interface MapContainerProps {
  selectedLocation: SearchResult | null;
  mapPosition: [number, number];
  inputValue: {
    name: string;
    address: string;
  };
}

const MapContainer = ({
  selectedLocation,
  mapPosition,
  inputValue
}: MapContainerProps) => {
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
    <div className="group w-full aspect-video relative overflow-hidden rounded-lg transition-all">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            Loading...
          </div>
        }
      >
        <Yolo position={mapPosition} markers={markers} />

        <div
          className={cn(
            'transition-all duration-300',
            'absolute inset-0 p-4 flex flex-col gap-0 items-start justify-end',
            'bg-gradient-to-t from-black/50 to-transparent',
            'group-hover:opacity-0 group-hover:pointer-events-none'
          )}
        >
          <div
            className={cn(
              'text-white/90 text-2xl uppercase font-black',
              inter.className
            )}
          >
            {inputValue.name}
          </div>
          <div className={cn('text-white/80 text-xl', open.className)}>
            {inputValue.address}
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default React.memo(MapContainer);
