'use client';

import dynamic from 'next/dynamic';

// Import MapView dynamically with SSR disabled
const MapViewComponent = dynamic(() => import('./MapView'), {
  ssr: false
});

const Yolo = (props: {
  position: [number, number];
  zoom?: number;
  markers: { id: string; position: [number, number] }[];
}) => {
  return <MapViewComponent {...props} />;
};

export default Yolo;
