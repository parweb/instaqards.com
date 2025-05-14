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

const getClusterColor = (count: number) => {
  if (count <= 10) {
    return {
      from: 'from-emerald-500',
      via: 'via-green-500',
      to: 'to-teal-600',
      border: 'border-emerald-600',
      text: 'text-emerald-600'
    };
  } else if (count <= 50) {
    return {
      from: 'from-blue-500',
      via: 'via-indigo-500',
      to: 'to-violet-600',
      border: 'border-indigo-600',
      text: 'text-indigo-600'
    };
  } else if (count <= 100) {
    return {
      from: 'from-amber-500',
      via: 'via-orange-500',
      to: 'to-red-600',
      border: 'border-amber-600',
      text: 'text-amber-600'
    };
  } else {
    return {
      from: 'from-rose-500',
      via: 'via-pink-500',
      to: 'to-red-600',
      border: 'border-rose-600',
      text: 'text-rose-600'
    };
  }
};

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
        maxClusterRadius: 60,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 16,
        chunkedLoading: true,
        chunkInterval: 200,
        chunkDelay: 50,
        spiderLegPolylineOptions: { weight: 1.5, color: '#2563eb', opacity: 0.5 },
        iconCreateFunction: (cluster: any) => {
          const childCount = cluster.getChildCount();
          const colors = getClusterColor(childCount);
          
          return L.divIcon({
            html: `
              <div class="relative flex items-center justify-center w-14 h-14">
                <div class="absolute inset-0 bg-white rounded-full shadow-2xl transform -rotate-8 transition-all duration-500 ease-out"></div>
                <div class="absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.via} ${colors.to} rounded-full shadow-2xl transform rotate-8 transition-all duration-500 ease-out"></div>
                <div class="relative flex items-center justify-center w-12 h-12 bg-white rounded-full border-3 ${colors.border} shadow-lg transition-all duration-500 ease-out">
                  <span class="${colors.text} font-bold text-lg">${childCount}</span>
                </div>
              </div>
            `,
            className: '',
            iconSize: L.point(56, 56)
          });
        }
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
        title: marker.name || marker.id,
        icon: L.divIcon({
          html: `
            <div class="isolate relative group select-none" style="width:48px;height:64px;">
              <div class="absolute left-0 top-0 w-12 h-12 rounded-full bg-purple-400/10 blur-md transform scale-[1.2] group-hover:scale-[1.25] transition-transform duration-500"></div>
              <div class="z-10 absolute left-0 top-0 w-12 h-12 group-hover:scale-105 transition-all duration-500">
                <div class="absolute -inset-1 bg-gradient-to-br from-purple-300/40 to-purple-700/40 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-purple-800 border border-white/20 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_12px_rgba(90,20,150,0.4)] overflow-hidden flex items-center justify-center group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_15px_rgba(90,20,150,0.5)] transition-all duration-500">
                  <div class="absolute -top-6 -left-6 w-[150%] h-6 bg-white/40 rotate-45 blur-sm transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-1000"></div>
                  <div class="absolute w-7 h-7 rounded-full bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-md border border-white/40 shadow-[inset_0_-2px_5px_rgba(0,0,0,0.1),0_2px_5px_rgba(255,255,255,0.4)] group-hover:w-8 group-hover:h-8 transition-all duration-300 flex items-center justify-center">
                    <div class="absolute inset-0 rounded-full bg-white/5 shadow-[inset_0_0_15px_5px_rgba(139,92,246,0.15)]"></div>
                    <div class="absolute top-[20%] left-[20%] w-2 h-1 rounded-full bg-white/90 rotate-[-20deg] blur-[0.5px]"></div>
                    <div class="absolute top-[30%] left-[30%] w-1 h-1 rounded-full bg-white/80 blur-[0.2px]"></div>
                  </div>
                </div>
              </div>
              <div class="z-0 absolute left-1/2 top-[44px] w-7 h-4.5" style="transform:translateX(-50%)">
                <div class="absolute w-4 h-1 bg-black/15 rounded-full blur-[2px] left-1/2 bottom-0 transform -translate-x-1/2 group-hover:w-5 transition-all duration-500"></div>
                <div class="absolute w-full h-full">
                  <div class="w-full h-full bg-gradient-to-b from-purple-400 to-purple-900 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_2px_4px_rgba(90,20,150,0.3)]" 
                       style="clip-path: polygon(50% 100%, 20% 0, 80% 0); border-radius: 2px 2px 40% 40% / 2px 2px 8% 8%;"></div>
                  <div class="absolute w-[60%] h-[50%] top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-white/40 to-white/5"
                       style="clip-path: polygon(50% 100%, 0 0, 100% 0); border-radius: 40% 40% 0 0;"></div>                  
                  <div class="absolute h-full w-[1px] top-0 left-[calc(20%+1px)] bg-purple-300/30 blur-[0.5px]"></div>
                  <div class="absolute h-full w-[1px] top-0 right-[calc(20%+1px)] bg-purple-300/30 blur-[0.5px]"></div>
                </div>
              </div>
            </div>
          `,
          className: '',
          iconSize: [48, 64],
          iconAnchor: [24, 48.5]
        })
      });
      
      if (marker.name) {
        markerInstance.bindPopup(`
          <div class="p-5 bg-white rounded-2xl shadow-3xl border-2 border-indigo-100">
            <div class="text-lg font-bold text-gray-900">${marker.name}</div>
            <div class="mt-2 text-sm text-gray-600">Cliquez pour plus d'informations</div>
          </div>
        `, {
          className: 'custom-popup',
          maxWidth: 300,
          minWidth: 200
        });
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
