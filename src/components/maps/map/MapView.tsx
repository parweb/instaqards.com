'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
  () => import('./MapViewInner').then(mod => mod.MapViewInner),
  { ssr: false }
);

const MapView = ({
  boundsPositions,
  position,
  zoom = 13,
  markers
}: {
  boundsPositions?: [number, number][];
  position?: [number, number];
  zoom?: number;
  markers: { id: string; position: [number, number] }[];
}) => {
  return (
    <div className="relative h-full w-full">
      <LeafletMap
        boundsPositions={boundsPositions}
        position={position}
        zoom={zoom}
        markers={markers}
      />
    </div>
  );
};

export default MapView;
