'use client';

import { Block, Prisma, Site } from '@prisma/client';
import { atom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import L from 'leaflet';
import { isEqual } from 'lodash';
import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import { LuLoader } from 'react-icons/lu';
import * as z from 'zod';

import { BlockList } from 'app/[domain]/client';
import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Footer } from 'components/website/footer';
import { Main } from 'components/website/main';
import { Wrapper } from 'components/website/wrapper';
import { BlockSchema, SiteSchema } from '../../../../prisma/generated/zod';

import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';

// Add global style to remove default Leaflet popup background
const customPopupStyle = `
  .leaflet-marker-icon {
    display: none;
  }
    
  .custom-popup-class .leaflet-popup-content-wrapper {
    background: transparent;
    box-shadow: none;
    border: none;
    padding: 0;
  }
  .custom-popup-class .leaflet-popup-tip-container {
    display: none;
  }
  .custom-popup-class .leaflet-popup-content {
    margin: 0;
    padding: 0;
  }
  .custom-popup-class .leaflet-popup-close-button {
    color: white;
    text-shadow: 0 0 3px rgba(0,0,0,0.4);
    z-index: 30;
    top: 5px;
    right: 5px;
  }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shine {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }
`;

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

// Composant React pour l'icône de cluster
const ClusterIcon = ({ count, colors }: { count: number; colors: any }) => (
  <div className="relative flex items-center justify-center w-14 h-14">
    <div className="absolute inset-0 bg-white rounded-full shadow-2xl transform -rotate-8 transition-all duration-500 ease-out"></div>
    <div
      className={`absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.via} ${colors.to} rounded-full shadow-2xl transform rotate-8 transition-all duration-500 ease-out`}
    ></div>
    <div
      className={`relative flex items-center justify-center w-12 h-12 bg-white rounded-full border-3 ${colors.border} shadow-lg transition-all duration-500 ease-out`}
    >
      <span className={`${colors.text} font-bold text-lg`}>{count}</span>
    </div>
  </div>
);

// Composant React pour l'icône de marker
const MarkerIcon = () => (
  <div
    className="isolate relative group select-none"
    style={{ width: '48px', height: '64px' }}
  >
    <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-purple-400/10 blur-md transform scale-[1.2] group-hover:scale-[1.25] transition-transform duration-500"></div>

    <div className="z-10 absolute left-0 top-0 w-12 h-12 group-hover:scale-105 transition-all duration-500">
      <div className="absolute -inset-1 bg-gradient-to-br from-purple-300/40 to-purple-700/40 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-purple-800 border border-white/20 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_12px_rgba(90,20,150,0.4)] overflow-hidden flex items-center justify-center group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_15px_rgba(90,20,150,0.5)] transition-all duration-500">
        <div className="absolute -top-6 -left-6 w-[150%] h-6 bg-white/40 rotate-45 blur-sm transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-1000"></div>
        <div className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-md border border-white/40 shadow-[inset_0_-2px_5px_rgba(0,0,0,0.1),0_2px_5px_rgba(255,255,255,0.4)] group-hover:w-8 group-hover:h-8 transition-all duration-300 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/5 shadow-[inset_0_0_15px_5px_rgba(139,92,246,0.15)]"></div>
          <div className="absolute top-[20%] left-[20%] w-2 h-1 rounded-full bg-white/90 rotate-[-20deg] blur-[0.5px]"></div>
          <div className="absolute top-[30%] left-[30%] w-1 h-1 rounded-full bg-white/80 blur-[0.2px]"></div>
        </div>
      </div>
    </div>

    <div
      className="z-0 absolute left-1/2 top-[44px] w-7 h-4.5"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div className="absolute w-4 h-1 bg-black/15 rounded-full blur-[2px] left-1/2 bottom-0 transform -translate-x-1/2 group-hover:w-5 transition-all duration-500"></div>
      <div className="absolute w-full h-full">
        <div
          className="w-full h-full bg-gradient-to-b from-purple-400 to-purple-900 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_2px_4px_rgba(90,20,150,0.3)]"
          style={{
            clipPath: 'polygon(50% 100%, 20% 0, 80% 0)',
            borderRadius: '2px 2px 40% 40% / 2px 2px 8% 8%'
          }}
        ></div>
        <div
          className="absolute w-[60%] h-[50%] top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-white/40 to-white/5"
          style={{
            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            borderRadius: '40% 40% 0 0'
          }}
        ></div>
        <div className="absolute h-full w-[1px] top-0 left-[calc(20%+1px)] bg-purple-300/30 blur-[0.5px]"></div>
        <div className="absolute h-full w-[1px] top-0 right-[calc(20%+1px)] bg-purple-300/30 blur-[0.5px]"></div>
      </div>
    </div>
  </div>
);

// Composant React pour le contenu du popup
const CustomPopupContent = ({
  marker
}: {
  marker: { id: string; position: [number, number]; name?: string };
}) => (
  <div className="transform transition-all duration-300 popup-content">
    <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/20 backdrop-filter backdrop-blur-lg bg-white/10">
      <div className="absolute -inset-[100%] bg-gradient-to-r from-purple-600/20 via-pink-600/0 to-blue-600/20 animate-[gradient-shift_8s_ease-in-out_infinite]"></div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-2xl opacity-80"></div>
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-2xl opacity-80"></div>

      <div className="relative backdrop-filter backdrop-blur-md bg-white/70 overflow-hidden flex flex-col">
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 animate-[gradient-shift_3s_ease-in-out_infinite]"></div>

        <div className="px-5 py-4 flex items-start">
          <div className="relative flex-shrink-0 mr-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/60 to-purple-800/60 blur-sm transform scale-[1.15] opacity-70"></div>

            <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-800 rounded-full flex items-center justify-center shadow-lg border border-white/30">
              <span className="text-white text-sm font-bold tracking-wide">
                {marker.name?.charAt(0) || '?'}
              </span>
              <div className="absolute top-[20%] left-[20%] w-2 h-1 rounded-full bg-white/80 rotate-[-20deg] blur-[0.5px]"></div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-purple-900 tracking-tight leading-tight mb-0.5 group-hover:text-purple-700 transition-colors duration-300">
              {marker.name || ''}
            </h3>

            <div className="flex items-center text-xs text-purple-700/80">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                ></path>
              </svg>

              <span>Explorer ce lieu</span>
            </div>
          </div>
        </div>

        <div className="px-5 pb-4 text-sm text-purple-800/90 leading-snug">
          <p>Cliquez pour découvrir ce lieu et ses informations détaillées.</p>
        </div>

        <div className="px-5 pb-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {/* <button 
            className="group relative px-4 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:from-purple-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white/50 overflow-hidden"
            data-zoom-center={`${marker.position[0]},${marker.position[1]}`}
          >
            <span className="relative z-10">Zoomer et centrer ici</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute -inset-[100%] blur-md bg-gradient-to-r from-purple-400/0 via-purple-400/40 to-purple-400/0 group-hover:animate-[shine_1.5s_ease-out]"></div>
          </button> */}

          <button className="group relative px-4 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:from-purple-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white/50 overflow-hidden">
            <span className="relative z-10">Voir plus</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute -inset-[100%] blur-md bg-gradient-to-r from-purple-400/0 via-purple-400/40 to-purple-400/0 group-hover:animate-[shine_1.5s_ease-out]"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SiteWithBlocks = SiteSchema.merge(
  z.object({
    blocks: z.array(BlockSchema)
  })
);

const $site = atomFamily(
  (params: Prisma.SiteFindUniqueArgs) =>
    atom(() =>
      fetch('/api/lake/site/findUnique', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(data => SiteWithBlocks.parse(data))
    ),
  isEqual
);

const Qards = ({ siteId }: { siteId: Site['id'] }) => {
  const site = useAtomValue(
    $site({
      where: { id: siteId },
      include: { blocks: true }
    })
  );

  const data: Record<Block['type'], Block[]> = {
    main: [],
    social: [],

    ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
  };

  return (
    <div className="relative w-full aspect-[2/3] max-w-xl mx-auto flex overflow-hidden rounded-2xl">
      <Wrapper>
        <Suspense fallback={null}>
          <Background background={site.background} />
        </Suspense>

        <Content>
          <Main length={data.main.length}>
            <Suspense fallback={null}>
              <BlockList blocks={data.main} />
            </Suspense>
          </Main>

          <Footer>
            <div className="flex gap-3 items-center justify-center">
              <Suspense fallback={null}>
                <BlockList blocks={data.social} />
              </Suspense>
            </div>
          </Footer>
        </Content>
      </Wrapper>
    </div>
  );
};

const CustomPopupContentQards = ({
  marker
}: {
  marker: { id: string; position: [number, number]; name?: string };
}) => {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <LuLoader className="animate-spin" />
          </div>
        }
      >
        <Qards siteId={marker.id} />
      </Suspense>
    </div>
  );
};

const MapViewInner = ({
  boundsPositions,
  position,
  zoom = 13,
  markers
}: {
  boundsPositions?: [number, number][];
  position?: [number, number];
  zoom?: number;
  markers: { id: string; position: [number, number]; name?: string }[];
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerClusterRef = useRef<MarkerClusterGroup | null>(null);
  const isInitialRender = useRef(true);
  const lastKnownPosition = useRef(position || [48.8566, 2.3522]);

  // Memoize marker positions to avoid unnecessary rerenders
  const markerPositions = useMemo(
    () =>
      markers.map(marker => ({
        id: marker.id,
        position: marker.position,
        name: marker.name
      })),
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
        spiderLegPolylineOptions: {
          weight: 1.5,
          color: '#2563eb',
          opacity: 0.5
        },
        iconCreateFunction: (cluster: any) => {
          const childCount = cluster.getChildCount();
          const colors = getClusterColor(childCount);
          return L.divIcon({
            html: ReactDOMServer.renderToString(
              <ClusterIcon count={childCount} colors={colors} />
            ),
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
          html: ReactDOMServer.renderToString(<MarkerIcon />),
          ...L.divIcon({
            className: '',
            iconSize: [48, 64],
            iconAnchor: [24, 48.5]
          })
        })
      });

      if (marker.name) {
        // Utilise un conteneur vide pour le popup
        const popupContainerId = `popup-qards-${marker.id}`;
        markerInstance.bindPopup(`<div id="${popupContainerId}"></div>`, {
          className: 'custom-popup-class',
          maxWidth: 280,
          minWidth: 240,
          closeButton: false,
          autoClose: false,
          closeOnEscapeKey: true,
          closeOnClick: false
        });

        // Ajoute le rendu dynamique lors de l'ouverture du popup
        markerInstance.on('popupopen', () => {
          const container = document.getElementById(popupContainerId);
          if (container) {
            // Utilise createRoot pour React 18+
            const root = createRoot(container);
            // Stocke le root sur l'élément pour le cleanup
            (container as any).__reactRoot = root;
            root.render(<CustomPopupContentQards marker={marker} />);
          }
        });
        // Nettoie le composant lors de la fermeture du popup
        markerInstance.on('popupclose', () => {
          const container = document.getElementById(popupContainerId);
          if (container && (container as any).__reactRoot) {
            (container as any).__reactRoot.unmount();
            delete (container as any).__reactRoot;
          }
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
      // Inject custom styles for popup
      const styleElement = document.createElement('style');
      styleElement.innerHTML = customPopupStyle;
      document.head.appendChild(styleElement);

      const mapInstance = L.map(mapRef.current, {
        center: position || [48.8566, 2.3522],
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
      lastKnownPosition.current = position || [48.8566, 2.3522];

      // Fit bounds if boundsPositions is provided
      if (boundsPositions && boundsPositions.length > 1) {
        const bounds = L.latLngBounds(boundsPositions);
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
      }

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

  // Fit bounds on markers change
  useEffect(() => {
    const mapInstance = mapInstanceRef.current;
    if (!mapInstance || !boundsPositions || boundsPositions.length < 2) return;
    const bounds = L.latLngBounds(boundsPositions);
    mapInstance.fitBounds(bounds, { padding: [50, 50] });
  }, [boundsPositions]);

  // Update view when position changes, but keep markers
  useEffect(() => {
    const mapInstance = mapInstanceRef.current;
    if (!mapInstance || isInitialRender.current) return;

    // Only update if position actually changed
    const safePosition = position || [48.8566, 2.3522];
    if (
      safePosition[0] === lastKnownPosition.current[0] &&
      safePosition[1] === lastKnownPosition.current[1]
    ) {
      return;
    }

    lastKnownPosition.current = safePosition;

    // First ensure markers are placed and visible
    updateMarkers();

    // Then animate map to new position
    mapInstance.flyTo(safePosition, zoom, animationConfig);
  }, [position, zoom, animationConfig, updateMarkers]);

  // Update markers when they change, independent of position changes
  useEffect(() => {
    if (!mapInstanceRef.current || isInitialRender.current) return;
    updateMarkers();
  }, [markerPositions, updateMarkers]);

  // Add event delegation for zoom/center button
  useEffect(() => {
    function handlePopupClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest('[data-zoom-center]');
      if (btn && mapInstanceRef.current) {
        const attr = btn.getAttribute('data-zoom-center');
        if (attr) {
          const [lat, lng] = attr.split(',').map(Number);
          mapInstanceRef.current.setView([lat, lng], 16, { animate: true });
        }
      }
    }
    document.body.addEventListener('click', handlePopupClick);
    return () => document.body.removeEventListener('click', handlePopupClick);
  }, []);

  return (
    <div className="w-full h-full map-container overflow-hidden">
      <style jsx global>{`
        .leaflet-marker-icon {
          border: none !important;
          background: transparent !important;
        }
        .custom-popup-class .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          border: none;
          padding: 0;
        }
        .custom-popup-class .leaflet-popup-tip-container {
          display: none;
        }
        .custom-popup-class .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        .custom-popup-class .leaflet-popup-close-button {
          color: white;
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
          z-index: 30;
          top: 5px;
          right: 5px;
        }
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes shine {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default MapViewInner;
