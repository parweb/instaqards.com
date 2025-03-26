import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  ZoomControl
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  position: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    id: string;
  }>;
}

// Component to update map view when props change
const ChangeView = React.memo<{ center: [number, number]; zoom: number }>(
  ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
      // Attendre que la carte soit prête
      const checkMapReady = () => {
        try {
          const container = map.getContainer();
          if (!container) return false;

          const center = map.getCenter();
          if (!center) return false;

          return true;
        } catch (error) {
          return false;
        }
      };

      // Vérifier périodiquement si la carte est prête
      const intervalId = setInterval(() => {
        if (checkMapReady()) {
          clearInterval(intervalId);
          const flyToAnimation = map.flyTo(center, zoom, {
            duration: 1.5,
            easeLinearity: 0.25
          });

          return () => {
            if (flyToAnimation?.stop) {
              flyToAnimation.stop();
            }
          };
        }
      }, 100);

      return () => {
        clearInterval(intervalId);
      };
    }, [center, zoom, map]);

    return null;
  }
);

ChangeView.displayName = 'ChangeView';

const MapView: React.FC<MapViewProps> = ({
  position,
  zoom = 13,
  markers = [{ position, id: 'default' }]
}) => {
  console.log({ position, zoom, markers });

  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  const animateMarker = useCallback((markerId: string) => {
    const marker = markerRefs.current.get(markerId);
    if (!marker) return;

    const markerElement = marker.getElement();
    if (!markerElement) return;

    markerElement.style.transition =
      'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    markerElement.style.transform = 'translateY(-10px)';

    const timeoutId = setTimeout(() => {
      if (markerElement) {
        markerElement.style.transform = 'translateY(0)';
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    for (const marker of markers) {
      const cleanup = animateMarker(marker.id);
      return () => cleanup?.();
    }
  }, [markers, animateMarker]);

  const mapContainerStyle = useMemo(
    () => ({
      height: '100%',
      width: '100%'
    }),
    []
  );

  return (
    <div className="w-full h-full map-container overflow-hidden">
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        style={mapContainerStyle}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ChangeView center={position} zoom={zoom} />

        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            ref={ref => {
              if (ref) {
                markerRefs.current.set(marker.id, ref);
              } else {
                markerRefs.current.delete(marker.id);
              }
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default React.memo(MapView);
