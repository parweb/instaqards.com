'use client';

import L from 'leaflet';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';

const MapViewInner = ({
  position,
  zoom = 13,
  markers
}: {
  position: [number, number];
  zoom?: number;
  markers: { id: string; position: [number, number] }[];
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRefsMap = useRef<Map<string, L.Marker>>(new Map());
  const isInitialRender = useRef(true);
  const lastKnownPosition = useRef(position);

  // Memoize marker positions to avoid unnecessary rerenders
  const markerPositions = useMemo(
    () => markers.map(marker => ({ id: marker.id, position: marker.position })),
    [markers]
  );

  // Create a stable animation config
  const animationConfig = useMemo(
    () => ({
      duration: 0.8,
      easeLinearity: 0.25
    }),
    []
  );

  // Create and update markers without removing existing ones
  const updateMarkers = useCallback(() => {
    const mapInstance = mapInstanceRef.current;
    if (!mapInstance) return;

    const currentMarkers = markerRefsMap.current;

    if (markerPositions.length === 0) {
      // Only clear markers if there are no new markers to show
      currentMarkers.forEach(marker => marker.remove());
      currentMarkers.clear();
      return;
    }

    // Create a set of current marker IDs
    const currentMarkerIds = new Set(markerPositions.map(m => m.id));

    // Remove markers that are no longer needed
    currentMarkers.forEach((marker, id) => {
      if (!currentMarkerIds.has(id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    });

    // Add or update markers
    markerPositions.forEach(marker => {
      // Check if marker already exists
      const existingMarker = currentMarkers.get(marker.id);

      if (existingMarker) {
        // Update existing marker position
        existingMarker.setLatLng(marker.position);
      } else {
        // Create new marker
        const markerInstance = L.marker(marker.position, {
          // Make sure marker stays on top and is interactive
          zIndexOffset: 1000,
          interactive: true,
          keyboard: false
        }).addTo(mapInstance);

        currentMarkers.set(marker.id, markerInstance);

        // Animate new marker appearance
        const markerElement = markerInstance.getElement();
        if (markerElement) {
          markerElement.style.opacity = '0';
          markerElement.style.transform = 'translateY(-10px)';
          markerElement.style.transition =
            'transform 0.3s ease-out, opacity 0.3s ease-out';

          // Force browser to process the style changes before changing them
          requestAnimationFrame(() => {
            if (markerElement) {
              markerElement.style.opacity = '1';
              markerElement.style.transform = 'translateY(0)';
            }
          });
        }
      }
    });
  }, [markerPositions]);

  // Initialize map - run once
  useEffect(() => {
    if (!mapRef.current) return;

    // Only initialize the map if it hasn't been created yet
    if (!mapInstanceRef.current) {
      const mapInstance = L.map(mapRef.current, {
        center: position,
        zoom: zoom,
        zoomControl: false,
        fadeAnimation: true,
        markerZoomAnimation: true,
        renderer: L.canvas()
      });

      // Add tile layer with optimized options
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
        updateWhenIdle: true,
        updateWhenZooming: false,
        keepBuffer: 2
      }).addTo(mapInstance);

      // Add zoom control to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

      mapInstanceRef.current = mapInstance;
      isInitialRender.current = false;
      lastKnownPosition.current = position;

      // Initialize markers after map is ready
      setTimeout(() => {
        if (updateMarkers && typeof updateMarkers === 'function') {
          updateMarkers();
        }
      }, 100);
    }

    return () => {
      const mapInstance = mapInstanceRef.current;
      if (!mapInstance) return;

      // Create a local copy of the markers
      const markerMap = new Map(markerRefsMap.current);

      // Remove all markers
      markerMap.forEach(marker => marker.remove());

      // Clean up the map
      mapInstance.off();
      mapInstance.remove();

      // Reset refs
      mapInstanceRef.current = null;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      markerRefsMap.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Enlever updateMarkers des dépendances

  // Update view when position changes, but keep markers
  useEffect(() => {
    const mapInstance = mapInstanceRef.current;
    if (!mapInstance || isInitialRender.current) return;

    // Only update if position actually changed
    if (
      position[0] === lastKnownPosition.current[0] &&
      position[1] === lastKnownPosition.current[1]
    ) {
      return;
    }

    lastKnownPosition.current = position;

    // First ensure markers are placed and visible
    updateMarkers();

    // Then animate map to new position
    mapInstance.flyTo(position, zoom, animationConfig);
  }, [position, zoom, animationConfig, updateMarkers]);

  // Update markers when they change, independent of position changes
  useEffect(() => {
    if (!mapInstanceRef.current || isInitialRender.current) return;
    updateMarkers();
  }, [markerPositions, updateMarkers]);

  return (
    <div className="w-full h-full map-container overflow-hidden">
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default MapViewInner;
