'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Leaflet map component with SSR disabled
const LeafletMap = dynamic(() => import('./MapViewInner'), {
  loading: () => <p>A map is loading</p>,
  ssr: false
});

const MapView = ({
  position,
  zoom = 13,
  markers
}: {
  position: [number, number];
  zoom?: number;
  markers: { id: string; position: [number, number] }[];
}) => {
  return (
    <div className="h-full w-full relative">
      <LeafletMap position={position} zoom={zoom} markers={markers} />
    </div>
  );
};

export default MapView;
