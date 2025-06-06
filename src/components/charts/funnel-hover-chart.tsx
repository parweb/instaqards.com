'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import {
  LuEye,
  LuMousePointer,
  LuTarget,
  LuTrendingDown,
  LuTrendingUp,
  LuUsers
} from 'react-icons/lu';

import { TooltipCard } from 'components/charts/tooltip-card-variations';

export interface FunnelStage {
  id: string;
  name: string;
  icon: React.ReactNode;
  value: number;
  total: number;
  color: string;
  textColor?: string;
}

interface TooltipData {
  stage: FunnelStage;
  percentage: number;
  conversionRate: number;
  x: number;
  y: number;
}

interface FunnelHoverChartProps {
  data: FunnelStage[];
  variant:
    | 'classic-tooltip'
    | 'circular-progress'
    | 'progress-bar'
    | 'card-style'
    | 'detailed-stats'
    | 'comparison'
    | 'bubble-style'
    | 'large-icon'
    | 'dashboard'
    | 'trend-indicator'
    | 'minimal';
}

export function FunnelHoverChart({ data, variant }: FunnelHoverChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [paths, setPaths] = useState<string[]>([]);
  const [sectionCenters, setSectionCenters] = useState<
    { x: number; y: number; width: number; height: number }[]
  >([]);
  const [hoveredTooltip, setHoveredTooltip] = useState<TooltipData | null>(
    null
  );

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

  const getConversionRate = (index: number) => {
    if (index === 0) return 100;
    const previousStage = data[index - 1];
    const currentStage = data[index];
    return previousStage.value > 0
      ? Math.round((currentStage.value / previousStage.value) * 100)
      : 0;
  };

  const handleMouseEnter = (
    stage: FunnelStage,
    index: number,
    event: React.MouseEvent
  ) => {
    const percentage =
      stage.total > 0 ? Math.round((stage.value / stage.total) * 100) : 0;
    const conversionRate = getConversionRate(index);
    const rect = event.currentTarget.getBoundingClientRect();

    setHoveredTooltip({
      stage,
      percentage,
      conversionRate,
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  const handleMouseLeave = () => {
    setHoveredTooltip(null);
  };

  const renderTooltip = () => {
    console.log({ hoveredTooltip });
    if (!hoveredTooltip) return null;

    const { stage, percentage, conversionRate, x, y } = hoveredTooltip;

    const tooltipStyle = {
      position: 'fixed' as const,
      left: x,
      top: y - 10,
      transform: 'translateX(-50%) translateY(-100%)',
      zIndex: 1000
    };

    debugger;

    switch (variant) {
      case 'classic-tooltip':
        return (
          <div
            style={tooltipStyle}
            className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
          >
            <div className="font-bold">{stage.name}</div>
            <div>
              {stage.value} ({percentage}%)
            </div>
          </div>
        );

      case 'circular-progress':
        return (
          <div
            style={tooltipStyle}
            className="rounded-xl border bg-white p-4 shadow-xl dark:bg-gray-800"
          >
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-12">
                <svg className="h-12 w-12 -rotate-90 transform">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke={stage.color}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${(percentage / 100) * 125.6} 125.6`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {percentage}%
                </div>
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {stage.name}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stage.value} interactions
                </div>
              </div>
            </div>
          </div>
        );

      case 'progress-bar':
        return (
          <div
            style={tooltipStyle}
            className="min-w-48 rounded-xl border bg-white p-4 shadow-xl dark:bg-gray-800"
          >
            <div className="mb-2 flex items-center space-x-2">
              <div style={{ color: stage.color }}>{stage.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white">
                {stage.name}
              </div>
            </div>
            <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {stage.value}
            </div>
            <div className="mb-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: stage.color
                }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {percentage}% du total
            </div>
          </div>
        );

      case 'card-style':
        return (
          <div
            style={{ ...tooltipStyle, borderLeftColor: stage.color }}
            className="min-w-56 rounded-xl border-l-4 bg-white p-4 shadow-xl dark:bg-gray-800"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stage.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Étape du funnel
                </div>
              </div>
              <div className="text-2xl" style={{ color: stage.color }}>
                {stage.icon}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Valeur
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {stage.value}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Pourcentage
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: stage.color }}
                >
                  {percentage}%
                </div>
              </div>
            </div>
          </div>
        );

      case 'detailed-stats':
        return (
          <div
            style={tooltipStyle}
            className="min-w-64 rounded-xl border bg-white p-4 shadow-xl dark:bg-gray-800"
          >
            <div className="mb-3 flex items-center space-x-2">
              <div style={{ color: stage.color }}>{stage.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white">
                {stage.name}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Interactions:
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {stage.value}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Pourcentage:
                </span>
                <span className="font-bold" style={{ color: stage.color }}>
                  {percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Conversion:
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {conversionRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total possible:
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {stage.total}
                </span>
              </div>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div
            style={tooltipStyle}
            className="min-w-72 rounded-xl border bg-white p-4 shadow-xl dark:bg-gray-800"
          >
            <div className="mb-3 flex items-center space-x-2">
              <div style={{ color: stage.color }}>{stage.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white">
                {stage.name}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stage.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Actuel
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">
                  {stage.total - stage.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Perdu
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center space-x-2">
              {conversionRate >= 70 ? (
                <LuTrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <LuTrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {conversionRate}% de conversion
              </span>
            </div>
          </div>
        );

      case 'bubble-style':
        return (
          <div style={tooltipStyle} className="relative">
            <div className="min-w-48 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-center text-white shadow-xl">
              <div className="text-lg font-bold">{stage.name}</div>
              <div className="text-2xl font-bold">{stage.value}</div>
              <div className="text-sm opacity-90">
                {percentage}% • {conversionRate}% conv.
              </div>
            </div>
            <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-8 border-r-8 border-l-8 border-transparent border-t-purple-600"></div>
          </div>
        );

      case 'large-icon':
        return (
          <div
            style={tooltipStyle}
            className="min-w-48 rounded-xl border bg-white p-6 text-center shadow-xl dark:bg-gray-800"
          >
            <div className="mb-3 text-6xl" style={{ color: stage.color }}>
              {stage.icon}
            </div>
            <div className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
              {stage.name}
            </div>
            <div
              className="mb-2 text-3xl font-bold"
              style={{ color: stage.color }}
            >
              {stage.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {percentage}% du total
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div
            style={tooltipStyle}
            className="min-w-80 rounded-xl border bg-white p-4 shadow-xl dark:bg-gray-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div style={{ color: stage.color }}>{stage.icon}</div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {stage.name}
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Étape {data.findIndex(d => d.id === stage.id) + 1}/4
              </div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stage.value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Interactions
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-lg font-bold"
                  style={{ color: stage.color }}
                >
                  {percentage}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Du total
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {conversionRate}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Conversion
                </div>
              </div>
            </div>
            <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-1 rounded-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: stage.color
                }}
              ></div>
            </div>
          </div>
        );

      case 'trend-indicator':
        return (
          <div
            style={tooltipStyle}
            className="min-w-64 rounded-xl border bg-white p-4 shadow-xl dark:bg-gray-800"
          >
            <div className="mb-3 flex items-center space-x-3">
              <div
                className="rounded-full p-2"
                style={{
                  backgroundColor: `${stage.color}20`,
                  color: stage.color
                }}
              >
                {stage.icon}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {stage.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Performance actuelle
                </div>
              </div>
            </div>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stage.value}
              </div>
              <div className="flex items-center space-x-1">
                {conversionRate >= 70 ? (
                  <>
                    <LuTrendingUp className="h-5 w-5 text-green-500" />
                    <span className="font-bold text-green-500">
                      +{conversionRate}%
                    </span>
                  </>
                ) : conversionRate >= 40 ? (
                  <>
                    <LuTarget className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-yellow-500">
                      {conversionRate}%
                    </span>
                  </>
                ) : (
                  <>
                    <LuTrendingDown className="h-5 w-5 text-red-500" />
                    <span className="font-bold text-red-500">
                      {conversionRate}%
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {conversionRate >= 70
                ? 'Excellente performance'
                : conversionRate >= 40
                  ? 'Performance correcte'
                  : 'Nécessite optimisation'}
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: stage.color
                }}
              ></div>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <TooltipCard title="49. Minimal Stats" variant="minimal-stats">
            <div className="min-w-64 rounded-lg border bg-white p-4 shadow-sm">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="mb-1 text-xs text-gray-500">Total</div>
                  <div className="text-lg font-bold">{stage.total}</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-xs text-gray-500">Actuel</div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: stage.color }}
                  >
                    {stage.value}
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-xs text-gray-500">Taux</div>
                  <div className="text-lg font-bold">{percentage}%</div>
                </div>
              </div>
            </div>
          </TooltipCard>
        );

      default:
        return null;
    }
  };

  console.log({ dimensions });

  return (
    <div className="">
      <div ref={containerRef} className="">
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
                    fill={data[index].color}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:brightness-110"
                    onMouseEnter={e => handleMouseEnter(data[index], index, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                </g>
              ))}

              {sectionCenters.map((center, index) => {
                const stage = data[index];
                const fontSize = getFontSize(center.width);

                return (
                  <g
                    key={`content-${stage.id}`}
                    className="pointer-events-none"
                  >
                    <text
                      x={center.x}
                      y={center.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize={`${fontSize + 6}px`}
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

      {renderTooltip()}
    </div>
  );
}

export default function FunnelHoverCharts() {
  const funnelData = [
    {
      id: 'sent',
      name: 'Envoyé',
      icon: <LuUsers className="h-5 w-5" />,
      value: 39,
      total: 39,
      color: '#10b981'
    },
    {
      id: 'delivered',
      name: 'Délivré',
      icon: <LuTarget className="h-5 w-5" />,
      value: 28,
      total: 39,
      color: '#3b82f6'
    },
    {
      id: 'opened',
      name: 'Ouvert',
      icon: <LuEye className="h-5 w-5" />,
      value: 3,
      total: 28,
      color: '#f59e0b'
    },
    {
      id: 'clicked',
      name: 'Cliqué',
      icon: <LuMousePointer className="h-5 w-5" />,
      value: 0,
      total: 3,
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="space-y-8">
      <FunnelHoverChart data={funnelData} variant="classic-tooltip" />
      <FunnelHoverChart data={funnelData} variant="circular-progress" />
      <FunnelHoverChart data={funnelData} variant="progress-bar" />
      <FunnelHoverChart data={funnelData} variant="card-style" />
      <FunnelHoverChart data={funnelData} variant="detailed-stats" />
      <FunnelHoverChart data={funnelData} variant="comparison" />
      <FunnelHoverChart data={funnelData} variant="bubble-style" />
      <FunnelHoverChart data={funnelData} variant="large-icon" />
      <FunnelHoverChart data={funnelData} variant="dashboard" />
      <FunnelHoverChart data={funnelData} variant="trend-indicator" />
    </div>
  );
}
