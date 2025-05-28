'use client';

import { memo, Suspense, useMemo } from 'react';

import LoadingDots from 'components/icons/loading-dots';
import { getMarkerPosition } from 'components/maps/map/MapMarker';
import Yolo from 'components/maps/map/Yolo';
import type { Location } from 'components/maps/types';
import { cn } from 'lib/utils';
import { inter, open } from 'styles/fonts';

interface MapContainerProps {
  selected: {
    id: Location['place_id'];
    display_name: Location['formatted_address'];
    lat: Location['geometry']['location']['lat'];
    lng: Location['geometry']['location']['lng'];
  } | null;
  mapPosition: [number, number];
  inputValue: {
    name: string;
    address: string;
  };
}

const MapContainer = ({
  selected,
  mapPosition,
  inputValue
}: MapContainerProps) => {
  // Memoize marker position calculation to prevent unnecessary re-renders
  const markerPosition = useMemo(
    () =>
      selected
        ? getMarkerPosition({ lat: selected.lat, lng: selected.lng })
        : null,
    [selected]
  );

  // Memoize markers array to prevent unnecessary re-renders
  const markers = useMemo(
    () => (markerPosition ? [markerPosition] : []),
    [markerPosition]
  );

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-lg transition-all">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <LoadingDots />
          </div>
        }
      >
        <Yolo position={mapPosition} markers={markers} />

        <div
          className={cn(
            'transition-all duration-300',
            'absolute inset-0 flex flex-col items-start justify-end gap-0 p-4',
            'bg-linear-to-t from-black/50 to-transparent',
            'group-hover:pointer-events-none group-hover:opacity-0'
          )}
        >
          {inputValue.name && (
            <div
              className={cn(
                'text-2xl font-black text-white/90 uppercase',
                inter.className
              )}
            >
              {inputValue.name}
            </div>
          )}

          {inputValue.address && (
            <div className={cn('text-xl text-white/80', open.className)}>
              {inputValue.address}
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default memo(MapContainer);
