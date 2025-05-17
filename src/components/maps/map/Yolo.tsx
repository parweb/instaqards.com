'use client';

import dynamic from 'next/dynamic';

const MapViewComponent = dynamic(() => import('./MapView'), { ssr: false });

const Yolo = (props: {
  boundsPositions?: [number, number][];
  position?: [number, number];
  zoom?: number;
  markers: { id: string; position: [number, number] }[];
}) => {
  return <MapViewComponent {...props} />;
};

export default Yolo;
