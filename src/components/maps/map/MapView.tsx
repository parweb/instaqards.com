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
    <div className="h-full w-full relative">
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
