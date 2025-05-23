'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';

import { cn } from 'lib/utils';

export interface FunnelStage {
  id: string;
  name: string;
  icon: React.ReactNode;
  value: number;
  total: number;
  color: string;
  textColor?: string;
}

interface FunnelChartProps {
  data: FunnelStage[];
  title: string;
  variant:
    | 'current'
    | 'right-legend'
    | 'integrated'
    | 'large-icons'
    | 'gradient'
    | 'minimal'
    | 'bordered'
    | 'top-legend'
    | 'cards'
    | '3d';
}

function FunnelChart({ data, title, variant }: FunnelChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [paths, setPaths] = useState<string[]>([]);
  const [sectionCenters, setSectionCenters] = useState<
    { x: number; y: number; width: number; height: number }[]
  >([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerWidth / 3;

        setDimensions({
          width: containerWidth,
          height: containerHeight
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const maxValue = data[0]?.value || 0;
    const { width, height } = dimensions;
    const spacing = 15;
    const curvature = 40;

    const adjustedSpacing = Math.max(2, Math.min(spacing, width / 50));
    const adjustedCurvature = Math.max(5, Math.min(curvature, width / 20));

    const newPaths: string[] = [];
    const newSectionCenters: {
      x: number;
      y: number;
      width: number;
      height: number;
    }[] = [];

    data.forEach((item, index) => {
      const ratio = item.value / maxValue;

      let nextRatio;
      if (index < data.length - 1) {
        const nextValue = data[index + 1].value;
        nextRatio = nextValue / maxValue;
        if (nextValue > 0 && nextRatio < 0.15) {
          nextRatio = 0.15;
        }
        if (nextValue === 0) {
          nextRatio = 0.08;
        }
      } else {
        nextRatio = item.value > 0 ? 0.15 : 0.08;
      }

      let adjustedRatio = ratio;
      if (item.value > 0 && ratio < 0.15) {
        adjustedRatio = 0.15;
      }
      if (item.value === 0) {
        adjustedRatio = 0.08;
      }

      const startHeight = adjustedRatio * height * 0.8;
      const endHeight = nextRatio * height * 0.8;

      const startY = (height - startHeight) / 2;
      const endY = (height - endHeight) / 2;

      const sectionWidth =
        (width - (data.length - 1) * adjustedSpacing) / data.length;
      const startX = index * (sectionWidth + adjustedSpacing);
      const endX = startX + sectionWidth;

      const heightDiff = Math.abs(startHeight - endHeight);
      const dynamicCurvature = Math.min(adjustedCurvature, heightDiff * 0.3);

      const path = `
        M ${startX} ${startY}
        C ${startX + dynamicCurvature} ${startY} ${endX - dynamicCurvature} ${endY} ${endX} ${endY}
        L ${endX} ${endY + endHeight}
        C ${endX - dynamicCurvature} ${endY + endHeight} ${startX + dynamicCurvature} ${startY + startHeight} ${startX} ${startY + startHeight}
        Z
      `;

      newPaths.push(path);

      const centerX = (startX + endX) / 2;
      const centerY = height / 2;
      const avgHeight = (startHeight + endHeight) / 2;

      newSectionCenters.push({
        x: centerX,
        y: centerY,
        width: sectionWidth,
        height: avgHeight
      });
    });

    setPaths(newPaths);
    setSectionCenters(newSectionCenters);
  }, [data, dimensions]);

  const getFontSize = (sectionWidth: number) => {
    return Math.max(8, Math.min(14, sectionWidth / 15));
  };

  const renderFunnel = () => (
    <div ref={containerRef} className="w-full">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <div className="relative">
          <svg
            width="100%"
            height={dimensions.height}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="xMidYMid meet"
            className="overflow-visible"
          >
            {paths.map((path, index) => (
              <g key={`funnel-${data[index].id}`}>
                <path
                  d={path}
                  fill={
                    variant === 'gradient'
                      ? `url(#gradient-${index})`
                      : variant === '3d'
                        ? data[index].color
                        : data[index].color
                  }
                  stroke={
                    variant === 'bordered'
                      ? '#333'
                      : variant === 'minimal'
                        ? 'none'
                        : 'rgba(255,255,255,0.2)'
                  }
                  strokeWidth={variant === 'bordered' ? '2' : '1'}
                  className={cn(
                    'transition-all duration-300',
                    variant === '3d' && 'drop-shadow-lg',
                    variant !== 'minimal' && 'hover:brightness-110'
                  )}
                  style={
                    variant === '3d'
                      ? {
                          filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
                        }
                      : {}
                  }
                />
                {variant === 'gradient' && (
                  <defs>
                    <linearGradient
                      id={`gradient-${index}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor={data[index].color} />
                      <stop
                        offset="100%"
                        stopColor={`${data[index].color}80`}
                      />
                    </linearGradient>
                  </defs>
                )}
              </g>
            ))}

            {sectionCenters.map((center, index) => {
              const stage = data[index];
              const fontSize = getFontSize(center.width);

              return (
                <g key={`content-${stage.id}`} className="pointer-events-none">
                  {variant === 'integrated' && (
                    <>
                      <foreignObject
                        x={center.x - 12}
                        y={center.y - 30}
                        width="24"
                        height="24"
                        className="overflow-visible"
                      >
                        <div className="flex items-center justify-center w-6 h-6 text-white">
                          {stage.icon}
                        </div>
                      </foreignObject>
                      <text
                        x={center.x}
                        y={center.y - 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize={`${fontSize}px`}
                        fontWeight="bold"
                        className="drop-shadow-lg"
                      >
                        {stage.name}
                      </text>
                    </>
                  )}

                  {variant === 'large-icons' && (
                    <foreignObject
                      x={center.x - 16}
                      y={center.y - 40}
                      width="32"
                      height="32"
                      className="overflow-visible"
                    >
                      <div className="flex items-center justify-center w-8 h-8 text-white bg-black bg-opacity-20 rounded-full backdrop-blur-sm">
                        {stage.icon}
                      </div>
                    </foreignObject>
                  )}

                  <text
                    x={center.x}
                    y={center.y + (variant === 'integrated' ? 8 : 0)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={`${fontSize + (variant === 'large-icons' ? 4 : 6)}px`}
                    fontWeight="bold"
                    className="drop-shadow-lg"
                  >
                    {stage.value.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );

  const renderLegend = () => {
    const legendContent = data.map((stage, index) => {
      const percentage =
        stage.total > 0 ? Math.round((stage.value / stage.total) * 100) : 0;

      if (variant === 'cards') {
        return (
          <div
            key={`legend-${stage.id}`}
            className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-md border-l-4"
            style={{ borderLeftColor: stage.color }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div style={{ color: stage.color }}>{stage.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white">
                {stage.name}
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {percentage}%
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: stage.color
                }}
              ></div>
            </div>
          </div>
        );
      }

      if (variant === 'minimal') {
        return (
          <div key={`legend-${stage.id}`} className="text-center">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stage.name}
            </div>
            <div className="text-lg font-bold" style={{ color: stage.color }}>
              {percentage}%
            </div>
          </div>
        );
      }

      return (
        <div
          key={`legend-${stage.id}`}
          className={cn(
            'flex items-center space-x-3',
            variant === 'right-legend' ? 'justify-start' : 'justify-center'
          )}
          style={{ color: stage.color }}
        >
          <div className="flex items-center justify-center w-8 h-8">
            {stage.icon}
          </div>
          <div className="font-bold">{stage.name}</div>
          <div className="font-semibold">{percentage}%</div>
          <div
            className="w-16 h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: `${stage.color}40` }}
          >
            <div
              className="h-full"
              style={{ width: `${percentage}%`, backgroundColor: stage.color }}
            ></div>
          </div>
        </div>
      );
    });

    if (variant === 'right-legend') {
      return <div className="space-y-4">{legendContent}</div>;
    }

    if (variant === 'top-legend') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {legendContent}
        </div>
      );
    }

    if (variant === 'cards') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {legendContent}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {legendContent}
      </div>
    );
  };

  if (variant === 'right-legend') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">{renderFunnel()}</div>
          <div className="lg:col-span-1">{renderLegend()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      {variant === 'top-legend' && renderLegend()}
      {renderFunnel()}
      {variant !== 'top-legend' && renderLegend()}
    </div>
  );
}

export default function FunnelCharts() {
  return (
    <div className="space-y-8">
      <FunnelChart
        data={[
          {
            id: 'sent',
            name: 'Envoyé',
            icon: '📧',
            value: 39,
            total: 39,
            color: '#10b981'
          },
          {
            id: 'delivered',
            name: 'Délivré',
            icon: '✅',
            value: 28,
            total: 39,
            color: '#3b82f6'
          },
          {
            id: 'opened',
            name: 'Ouvert',
            icon: '👁️',
            value: 3,
            total: 28,
            color: '#f59e0b'
          },
          {
            id: 'clicked',
            name: 'Cliqué',
            icon: '👆',
            value: 0,
            total: 3,
            color: '#8b5cf6'
          }
        ]}
        title="1. Version Actuelle"
        variant="current"
      />

      <FunnelChart
        data={[
          {
            id: 'sent',
            name: 'Envoyé',
            icon: '📧',
            value: 39,
            total: 39,
            color: '#10b981'
          },
          {
            id: 'delivered',
            name: 'Délivré',
            icon: '✅',
            value: 28,
            total: 39,
            color: '#3b82f6'
          },
          {
            id: 'opened',
            name: 'Ouvert',
            icon: '👁️',
            value: 3,
            total: 28,
            color: '#f59e0b'
          },
          {
            id: 'clicked',
            name: 'Cliqué',
            icon: '👆',
            value: 0,
            total: 3,
            color: '#8b5cf6'
          }
        ]}
        title="2. Légende à Droite"
        variant="right-legend"
      />

      <FunnelChart
        data={[
          {
            id: 'sent',
            name: 'Envoyé',
            icon: '📧',
            value: 39,
            total: 39,
            color: '#10b981'
          },
          {
            id: 'delivered',
            name: 'Délivré',
            icon: '✅',
            value: 28,
            total: 39,
            color: '#3b82f6'
          },
          {
            id: 'opened',
            name: 'Ouvert',
            icon: '👁️',
            value: 3,
            total: 28,
            color: '#f59e0b'
          },
          {
            id: 'clicked',
            name: 'Cliqué',
            icon: '👆',
            value: 0,
            total: 3,
            color: '#8b5cf6'
          }
        ]}
        title="3. Légende Intégrée"
        variant="integrated"
      />

      <FunnelChart
        data={[
          {
            id: 'sent',
            name: 'Envoyé',
            icon: '📧',
            value: 39,
            total: 39,
            color: '#10b981'
          },
          {
            id: 'delivered',
            name: 'Délivré',
            icon: '✅',
            value: 28,
            total: 39,
            color: '#3b82f6'
          },
          {
            id: 'opened',
            name: 'Ouvert',
            icon: '👁️',
            value: 3,
            total: 28,
            color: '#f59e0b'
          },
          {
            id: 'clicked',
            name: 'Cliqué',
            icon: '👆',
            value: 0,
            total: 3,
            color: '#8b5cf6'
          }
        ]}
        title="4. Icônes Grandes"
        variant="large-icons"
      />

      <FunnelChart
        data={[
          {
            id: 'sent',
            name: 'Envoyé',
            icon: '📧',
            value: 39,
            total: 39,
            color: '#10b981'
          },
          {
            id: 'delivered',
            name: 'Délivré',
            icon: '✅',
            value: 28,
            total: 39,
            color: '#3b82f6'
          },
          {
            id: 'opened',
            name: 'Ouvert',
            icon: '👁️',
            value: 3,
            total: 28,
            color: '#f59e0b'
          },
          {
            id: 'clicked',
            name: 'Cliqué',
            icon: '👆',
            value: 0,
            total: 3,
            color: '#8b5cf6'
          }
        ]}
        title="5. Version Gradient"
        variant="gradient"
      />

      <FunnelChart
        data={[
          {
            id: 'sent',
            name: 'Envoyé',
            icon: '📧',
            value: 39,
            total: 39,
            color: '#10b981'
          },
          {
            id: 'delivered',
            name: 'Délivré',
            icon: '✅',
            value: 28,
            total: 39,
            color: '#3b82f6'
          },
          {
            id: 'opened',
            name: 'Ouvert',
            icon: '👁️',
            value: 3,
            total: 28,
            color: '#f59e0b'
          },
          {
            id: 'clicked',
            name: 'Cliqué',
            icon: '👆',
            value: 0,
            total: 3,
            color: '#8b5cf6'
          }
        ]}
        title="6. Version Minimaliste"
        variant="minimal"
      />

      <FunnelChart
        data={[
          {
            id: 'sent',
            name: 'Envoyé',
            icon: '📧',
            value: 39,
            total: 39,
            color: '#10b981'
          },
          {
            id: 'delivered',
            name: 'Délivré',
            icon: '✅',
            value: 28,
            total: 39,
            color: '#3b82f6'
          },
          {
            id: 'opened',
            name: 'Ouvert',
            icon: '👁️',
            value: 3,
            total: 28,
            color: '#f59e0b'
          },
          {
            id: 'clicked',
            name: 'Cliqué',
            icon: '👆',
            value: 0,
            total: 3,
            color: '#8b5cf6'
          }
        ]}
        title="7. Version avec Bordures"
        variant="bordered"
      />

      <FunnelChart
        data={[
          {
            id: 'sent',
            name: 'Envoyé',
            icon: '📧',
            value: 39,
            total: 39,
            color: '#10b981'
          },
          {
            id: 'delivered',
            name: 'Délivré',
            icon: '✅',
            value: 28,
            total: 39,
            color: '#3b82f6'
          },
          {
            id: 'opened',
            name: 'Ouvert',
            icon: '👁️',
            value: 3,
            total: 28,
            color: '#f59e0b'
          },
          {
            id: 'clicked',
            name: 'Cliqué',
            icon: '👆',
            value: 0,
            total: 3,
            color: '#8b5cf6'
          }
        ]}
        title="8. Légende en Haut"
        variant="top-legend"
      />

      <FunnelChart
        data={[
          {
            id: 'sent',
            name: 'Envoyé',
            icon: '📧',
            value: 39,
            total: 39,
            color: '#10b981'
          },
          {
            id: 'delivered',
            name: 'Délivré',
            icon: '✅',
            value: 28,
            total: 39,
            color: '#3b82f6'
          },
          {
            id: 'opened',
            name: 'Ouvert',
            icon: '👁️',
            value: 3,
            total: 28,
            color: '#f59e0b'
          },
          {
            id: 'clicked',
            name: 'Cliqué',
            icon: '👆',
            value: 0,
            total: 3,
            color: '#8b5cf6'
          }
        ]}
        title="9. Style Cards"
        variant="cards"
      />

      <FunnelChart
        data={[
          {
            id: 'sent',
            name: 'Envoyé',
            icon: '📧',
            value: 39,
            total: 39,
            color: '#10b981'
          },
          {
            id: 'delivered',
            name: 'Délivré',
            icon: '✅',
            value: 28,
            total: 39,
            color: '#3b82f6'
          },
          {
            id: 'opened',
            name: 'Ouvert',
            icon: '👁️',
            value: 3,
            total: 28,
            color: '#f59e0b'
          },
          {
            id: 'clicked',
            name: 'Cliqué',
            icon: '👆',
            value: 0,
            total: 3,
            color: '#8b5cf6'
          }
        ]}
        title="10. Effet 3D"
        variant="3d"
      />
    </div>
  );
}
