'use client';

import L from 'leaflet';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';

type MarkerClusterGroup = L.MarkerClusterGroup;

const MapViewInner = ({
  position,
  zoom = 13,
  markers
}: {
  position: [number, number];
  zoom?: number;
  markers: { id: string; position: [number, number]; name?: string }[];
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerClusterRef = useRef<MarkerClusterGroup | null>(null);
  const isInitialRender = useRef(true);
  const lastKnownPosition = useRef(position);

  // Memoize marker positions to avoid unnecessary rerenders
  const markerPositions = useMemo(
    () => markers.map(marker => ({ id: marker.id, position: marker.position, name: marker.name })),
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

    // Initialize marker cluster if not exists
    if (!markerClusterRef.current) {
      const clusterGroup = (L as any).markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 15,
        chunkedLoading: true,
        chunkInterval: 200,
        chunkDelay: 50
      }) as MarkerClusterGroup;
      
      markerClusterRef.current = clusterGroup;
      mapInstance.addLayer(clusterGroup);
    }

    const clusterGroup = markerClusterRef.current;
    if (!clusterGroup) return;

    clusterGroup.clearLayers();

    // Add markers to cluster group
    markerPositions.forEach(marker => {
      const markerInstance = L.marker(marker.position, {
        title: marker.name || marker.id
      });
      
      if (marker.name) {
        markerInstance.bindPopup(marker.name);
      }
      
      clusterGroup.addLayer(markerInstance);
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

      // Clean up marker cluster
      if (markerClusterRef.current) {
        markerClusterRef.current.clearLayers();
        mapInstance.removeLayer(markerClusterRef.current);
        markerClusterRef.current = null;
      }

      // Clean up the map
      mapInstance.off();
      mapInstance.remove();

      // Reset refs
      mapInstanceRef.current = null;
    };
  }, []);

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
