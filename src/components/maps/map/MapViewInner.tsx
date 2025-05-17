'use client';

import L from 'leaflet'; // Import L for latLngBounds and other Leaflet utilities if needed
import { useMemo, useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server'; // Réintroduit
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

// Custom Components for Marker and Popup
import { ClusterIcon } from './ClusterIcon'; // Assuming ClusterIcon is a React component
import { CustomPopupContentQards } from './CustomPopupContentQards'; // Assuming CustomPopupContentQards is a React component
import { getClusterColor } from './getClusterColor'; // Utility for cluster colors
import { MarkerIcon } from './MarkerIcon'; // Assuming MarkerIcon is a React component

import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet.markercluster/dist/MarkerCluster.css'; // react-leaflet-markercluster still needs this
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'; // and this
import 'leaflet/dist/leaflet.css';

// Default values
const DEFAULT_MAP_CENTER: [number, number] = [48.8566, 2.3522]; // Paris
const DEFAULT_MAP_ZOOM = 13;

// Helper to validate LatLng tuple
function isValidLatLngTuple(val: any): val is [number, number] {
  return (
    Array.isArray(val) &&
    val.length === 2 &&
    typeof val[0] === 'number' &&
    typeof val[0] !== 'undefined' &&
    !isNaN(val[0]) &&
    typeof val[1] === 'number' &&
    typeof val[1] !== 'undefined' &&
    !isNaN(val[1])
  );
}

// Component Props
interface MapViewInnerProps {
  boundsPositions?: [number, number][];
  position?: [number, number];
  zoom?: number;
  markers: { id: string; position: [number, number]; name?: string }[];
}

// Helper component to adjust map view
const MapViewAdjuster = ({
  boundsPositions,
  position,
  zoom,
  animationConfig
}: {
  boundsPositions?: [number, number][];
  position?: [number, number];
  zoom?: number;
  animationConfig: { duration: number; easeLinearity: number };
}) => {
  const map = useMap();
  const prevPositionRef = useRef<[number, number] | undefined>(undefined);
  const prevZoomRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (boundsPositions && boundsPositions.length > 0) {
      const validBounds = boundsPositions.filter(isValidLatLngTuple);
      if (validBounds.length > 0) {
        const leafletBounds = L.latLngBounds(
          validBounds as L.LatLngExpression[]
        );
        map.fitBounds(leafletBounds, { padding: [50, 50] });
      }
      prevPositionRef.current = undefined;
      prevZoomRef.current = undefined;
    } else if (
      position &&
      isValidLatLngTuple(position) &&
      typeof zoom === 'number'
    ) {
      // Calcul de la distance entre l'ancienne et la nouvelle position
      const prev = prevPositionRef.current;
      const prevZoom = prevZoomRef.current;
      const curr = position;
      const distance = prev
        ? map.distance(L.latLng(prev), L.latLng(curr))
        : undefined;
      // Seuil pour choisir entre panTo (rapide) et flyTo (plus smooth)
      const PAN_THRESHOLD_METERS = 500; // Ajuste selon le ressenti
      if (
        prev &&
        distance !== undefined &&
        distance < PAN_THRESHOLD_METERS &&
        prevZoom === zoom
      ) {
        map.panTo(curr, { animate: true, duration: 0.3, easeLinearity: 0.5 });
      } else {
        map.flyTo(curr, zoom, { duration: 0.4, easeLinearity: 0.5 });
      }
      prevPositionRef.current = curr;
      prevZoomRef.current = zoom;
    }
  }, [map, boundsPositions, position, zoom, animationConfig]);

  return null;
};

export function MapViewInner({
  boundsPositions: boundsPositionsFromProps,
  position: positionFromProps,
  zoom: zoomFromProps,
  markers
}: MapViewInnerProps) {
  const mapInitialCenter = isValidLatLngTuple(positionFromProps)
    ? positionFromProps
    : DEFAULT_MAP_CENTER;
  const mapInitialZoom =
    typeof zoomFromProps === 'number' && !isNaN(zoomFromProps)
      ? zoomFromProps
      : DEFAULT_MAP_ZOOM;

  const markerData = useMemo(
    () =>
      markers
        .map(marker => ({
          id: marker.id,
          position: marker.position, // Assuming marker.position is already validated or Leaflet handles it
          name: marker.name
        }))
        .filter(marker => isValidLatLngTuple(marker.position)), // Filter out markers with invalid positions
    [markers]
  );

  const animationConfig = useMemo(
    () => ({ duration: 0.8, easeLinearity: 0.25 }),
    []
  );

  // Determine position/zoom for MapViewAdjuster's flyTo logic
  let flyToPositionForAdjuster: [number, number] | undefined = undefined;
  let flyToZoomForAdjuster: number | undefined = undefined;

  if (!boundsPositionsFromProps || boundsPositionsFromProps.length === 0) {
    // Only consider flying if not using bounds AND a valid position was explicitly passed
    if (isValidLatLngTuple(positionFromProps)) {
      flyToPositionForAdjuster = positionFromProps;
      flyToZoomForAdjuster =
        typeof zoomFromProps === 'number' && !isNaN(zoomFromProps)
          ? zoomFromProps
          : DEFAULT_MAP_ZOOM;
    }
    // If no bounds and no valid positionFromProps, adjuster won't flyTo, map uses mapInitialCenter/Zoom.
  }

  const createClusterCustomIcon = (cluster: any) => {
    const childCount = cluster.getChildCount();
    const colors = getClusterColor(childCount);
    const html = ReactDOMServer.renderToString(
      <ClusterIcon count={childCount} colors={colors} />
    ); // Retour à renderToString
    return L.divIcon({
      html: html,
      className: '',
      iconSize: L.point(56, 56, true)
    });
  };

  const customMarkerIcon = L.divIcon({
    // Redevient une constante L.divIcon
    html: ReactDOMServer.renderToString(<MarkerIcon />), // Retour à renderToString
    className: '',
    iconSize: [48, 64],
    iconAnchor: [24, 48.5]
  });

  return (
    <div className="w-full h-full map-container overflow-hidden">
      {/* <div ref={mapRef} style={{ height: '100%', width: '100%' }} /> */}
      <MapContainer
        center={mapInitialCenter}
        zoom={mapInitialZoom}
        style={{ height: '100%', width: '100%' }}
        maxZoom={19}
        zoomControl={true} // Enable react-leaflet's zoom control
        // scrollWheelZoom={true} // Default true, can be managed
        // Other MapContainer options can be added here
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          updateWhenIdle={true}
          updateWhenZooming={false} // Keep this false for performance with marker clusters
          keepBuffer={2}
        />
        {/* <L.Control.Zoom position="bottomright" />  This was causing an error */}

        <MapViewAdjuster
          boundsPositions={boundsPositionsFromProps}
          position={flyToPositionForAdjuster}
          zoom={flyToZoomForAdjuster}
          animationConfig={animationConfig}
        />

        <MarkerClusterGroup
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          disableClusteringAtZoom={16}
          chunkedLoading // Enable chunked loading
          // Other MarkerClusterGroup options
        >
          {markerData.map(marker => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.name || marker.id}
              icon={customMarkerIcon}
            >
              {marker.name && (
                <Popup
                  className="custom-popup-class" // Apply custom class for styling
                  maxWidth={320}
                  minWidth={320}
                  closeButton={false} // Assuming this is desired from previous setup
                  autoClose={false} // Assuming this is desired
                  closeOnEscapeKey={true}
                  // closeOnClick={false} // This might need custom handling if popups should stay open
                >
                  <CustomPopupContentQards marker={marker} />
                </Popup>
              )}
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
