'use client';

import { memo, Suspense, useMemo } from 'react';

import LoadingDots from 'components/icons/loading-dots';
import { getMarkerPosition } from 'components/maps/map/MapMarker';
import Yolo from 'components/maps/map/Yolo';
import type { Location } from 'components/maps/types';
import { cn } from 'lib/utils';
import { inter, open } from 'styles/fonts';

interface MapContainerProps {
  selectedLocation: {
    id: Location['id'];
    display_name: Location['properties']['label'];
    lat: Location['geometry']['coordinates'][0];
    lon: Location['geometry']['coordinates'][1];
  } | null;
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
    () => getMarkerPosition([selectedLocation.lat, selectedLocation.lon]),
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
            <LoadingDots />
          </div>
        }
      >
        <Yolo position={mapPosition} markers={markers} />

        <div
          className={cn(
            'transition-all duration-300',
            'absolute inset-0 p-4 flex flex-col gap-0 items-start justify-end',
            'bg-linear-to-t from-black/50 to-transparent',
            'group-hover:opacity-0 group-hover:pointer-events-none'
          )}
        >
          {inputValue.name && (
            <div
              className={cn(
                'text-white/90 text-2xl uppercase font-black',
                inter.className
              )}
            >
              {inputValue.name}
            </div>
          )}

          {inputValue.address && (
            <div className={cn('text-white/80 text-xl', open.className)}>
              {inputValue.address}
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default memo(MapContainer);
