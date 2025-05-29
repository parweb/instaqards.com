'use client';

import { Bell, ImageIcon, TrendingUp } from 'lucide-react';
import type React from 'react';

interface TooltipCardProps {
  title: string;
  variant: string;
  children: React.ReactNode;
}

export function TooltipCard({ title, children }: TooltipCardProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800">
      <h4 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h4>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

export default function TooltipCardVariations() {
  const stageData = {
    name: 'Délivré',
    icon: <ImageIcon className="h-5 w-5" />,
    value: 28,
    total: 39,
    color: '#3b82f6',
    percentage: 72,
    conversionRate: 72
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Card 1: Minimal Clean */}
      <TooltipCard title="41. Minimal Clean" variant="minimal-clean">
        <div className="min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div className="mb-2 flex items-center space-x-2">
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
            <div className="font-medium">{stageData.name}</div>
          </div>
          <div className="mb-1 text-2xl font-bold">{stageData.value}</div>
          <div className="text-sm text-gray-500">
            {stageData.percentage}% du total
          </div>
        </div>
      </TooltipCard>

      {/* Card 2: Gradient Border */}
      <TooltipCard title="42. Gradient Border" variant="gradient-border">
        <div
          className="min-w-64 rounded-lg bg-white p-4"
          style={{
            background: 'white',
            boxShadow: '0 0 0 3px #fff, 0 0 0 4px #3b82f6',
            border: '1px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(to right, #3b82f6, #8b5cf6)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'content-box, border-box'
          }}
        >
          <div className="text-center">
            <div className="mb-1 text-lg font-bold">{stageData.name}</div>
            <div
              className="text-3xl font-bold"
              style={{ color: stageData.color }}
            >
              {stageData.value}
            </div>
            <div className="text-sm text-gray-500">{stageData.percentage}%</div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 3: Dark Mode */}
      <TooltipCard title="43. Dark Mode" variant="dark-mode">
        <div className="min-w-64 rounded-lg bg-gray-900 p-4 text-white">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div style={{ color: stageData.color }}>{stageData.icon}</div>
              <div className="font-medium">{stageData.name}</div>
            </div>
            <div className="text-sm" style={{ color: stageData.color }}>
              {stageData.percentage}%
            </div>
          </div>
          <div className="mb-2 text-2xl font-bold">{stageData.value}</div>
          <div className="h-1 w-full rounded-full bg-gray-800">
            <div
              className="h-1 rounded-full"
              style={{
                width: `${stageData.percentage}%`,
                backgroundColor: stageData.color
              }}
            ></div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 4: Neumorphism */}
      <TooltipCard title="44. Neumorphism" variant="neumorphism">
        <div
          className="min-w-64 rounded-xl bg-gray-100 p-4"
          style={{ boxShadow: '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff' }}
        >
          <div className="mb-3 text-center">
            <div
              className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                boxShadow:
                  'inset 2px 2px 5px #d1d1d1, inset -2px -2px 5px #ffffff'
              }}
            >
              <div style={{ color: stageData.color }}>{stageData.icon}</div>
            </div>
            <div className="font-medium">{stageData.name}</div>
          </div>
          <div
            className="text-center text-2xl font-bold"
            style={{ color: stageData.color }}
          >
            {stageData.value}
          </div>
        </div>
      </TooltipCard>

      {/* Card 5: Floating Card */}
      <TooltipCard title="45. Floating Card" variant="floating-card">
        <div className="relative min-w-64 transform rounded-lg bg-white p-4 shadow-lg transition-transform duration-300 hover:-translate-y-1">
          <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
            {stageData.percentage}%
          </div>
          <div className="mb-3 flex items-center space-x-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${stageData.color}20` }}
            >
              <div style={{ color: stageData.color }}>{stageData.icon}</div>
            </div>
            <div>
              <div className="font-bold">{stageData.name}</div>
              <div className="text-sm text-gray-500">Étape 2</div>
            </div>
          </div>
          <div className="text-2xl font-bold">{stageData.value}</div>
        </div>
      </TooltipCard>

      {/* Card 6: Bordered Accent */}
      <TooltipCard title="46. Bordered Accent" variant="bordered-accent">
        <div
          className="min-w-64 rounded-r-lg border-l-4 bg-white p-4 shadow-md"
          style={{ borderColor: stageData.color }}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="font-bold">{stageData.name}</div>
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
          </div>
          <div className="mb-1 text-3xl font-bold">{stageData.value}</div>
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500">
              {stageData.conversionRate}% de conversion
            </span>
          </div>
        </div>
      </TooltipCard>

      {/* Card 7: Rounded Corners */}
      <TooltipCard title="47. Rounded Corners" variant="rounded-corners">
        <div className="min-w-64 rounded-3xl bg-white p-5 shadow-md">
          <div className="mb-3 flex items-center space-x-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: stageData.color }}
            >
              {stageData.icon}
            </div>
            <div>
              <div className="text-lg font-bold">{stageData.name}</div>
              <div className="text-sm text-gray-500">
                {stageData.percentage}% complété
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">
            {stageData.value} / {stageData.total}
          </div>
        </div>
      </TooltipCard>

      {/* Card 8: Gradient Background */}
      <TooltipCard
        title="48. Gradient Background"
        variant="gradient-background"
      >
        <div
          className="min-w-64 rounded-lg p-4 text-white"
          style={{
            background: `linear-gradient(135deg, ${stageData.color}, #8b5cf6)`
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="text-lg font-bold">{stageData.name}</div>
            <div className="rounded-full bg-white/20 p-2">{stageData.icon}</div>
          </div>
          <div className="mb-1 text-3xl font-bold">{stageData.value}</div>
          <div className="text-sm opacity-80">
            {stageData.percentage}% du total
          </div>
        </div>
      </TooltipCard>

      {/* Card 9: Minimal Stats */}
      <TooltipCard title="49. Minimal Stats" variant="minimal-stats">
        <div className="min-w-64 rounded-lg border bg-white p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="mb-1 text-xs text-gray-500">Total</div>
              <div className="text-lg font-bold">{stageData.total}</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-xs text-gray-500">Actuel</div>
              <div
                className="text-lg font-bold"
                style={{ color: stageData.color }}
              >
                {stageData.value}
              </div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-xs text-gray-500">Taux</div>
              <div className="text-lg font-bold">{stageData.percentage}%</div>
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 10: Outlined */}
      <TooltipCard title="50. Outlined" variant="outlined">
        <div
          className="min-w-64 rounded-lg border-2 p-4"
          style={{ borderColor: stageData.color, color: stageData.color }}
        >
          <div className="text-center">
            <div className="mb-2 text-4xl">{stageData.icon}</div>
            <div className="mb-1 text-lg font-bold">{stageData.name}</div>
            <div className="text-2xl font-bold">{stageData.value}</div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 11: Pill Shape */}
      <TooltipCard title="51. Pill Shape" variant="pill-shape">
        <div className="flex min-w-64 items-center space-x-3 rounded-full bg-white p-3 shadow-md">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: stageData.color }}
          >
            {stageData.icon}
          </div>
          <div>
            <div className="font-bold">{stageData.name}</div>
            <div className="text-sm text-gray-500">
              {stageData.value} ({stageData.percentage}%)
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 12: Layered */}
      <TooltipCard title="52. Layered" variant="layered">
        <div className="relative min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div
            className="absolute -top-2 -left-2 -z-10 h-full w-full rounded-lg"
            style={{ backgroundColor: `${stageData.color}40` }}
          ></div>
          <div className="mb-2 flex items-center justify-between">
            <div className="font-bold">{stageData.name}</div>
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
          </div>
          <div className="mb-1 text-2xl font-bold">{stageData.value}</div>
          <div className="text-sm text-gray-500">
            {stageData.percentage}% du total
          </div>
        </div>
      </TooltipCard>

      {/* Card 13: Minimalist Icon */}
      <TooltipCard title="53. Minimalist Icon" variant="minimalist-icon">
        <div className="min-w-64 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="text-4xl" style={{ color: stageData.color }}>
              {stageData.icon}
            </div>
            <div>
              <div className="text-3xl font-bold">{stageData.value}</div>
              <div className="text-sm text-gray-500">{stageData.name}</div>
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 14: Notification Style */}
      <TooltipCard title="54. Notification Style" variant="notification-style">
        <div
          className="min-w-64 rounded-lg border-t-4 bg-white p-4 shadow-md"
          style={{ borderColor: stageData.color }}
        >
          <div className="mb-2 flex items-center space-x-2">
            <Bell className="h-5 w-5" style={{ color: stageData.color }} />
            <div className="font-bold">Notification</div>
          </div>
          <div className="mb-2">
            <span className="font-medium">{stageData.name}:</span>{' '}
            {stageData.value} interactions ({stageData.percentage}%)
          </div>
          <div className="text-sm text-gray-500">Il y a 5 minutes</div>
        </div>
      </TooltipCard>

      {/* Card 15: Compact Data */}
      <TooltipCard title="55. Compact Data" variant="compact-data">
        <div className="min-w-64 rounded-lg bg-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div style={{ color: stageData.color }}>{stageData.icon}</div>
              <div className="font-medium">{stageData.name}</div>
            </div>
            <div className="text-lg font-bold">{stageData.value}</div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 16: Accent Top */}
      <TooltipCard title="56. Accent Top" variant="accent-top">
        <div className="min-w-64 overflow-hidden rounded-lg bg-white shadow-md">
          <div
            className="h-2"
            style={{ backgroundColor: stageData.color }}
          ></div>
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-bold">{stageData.name}</div>
              <div
                className="text-sm font-medium"
                style={{ color: stageData.color }}
              >
                {stageData.percentage}%
              </div>
            </div>
            <div className="mb-1 text-2xl font-bold">{stageData.value}</div>
            <div className="text-sm text-gray-500">
              sur {stageData.total} total
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 17: Circular Progress */}
      <TooltipCard title="57. Circular Progress" variant="circular-progress">
        <div className="min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90 transform">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={stageData.color}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(stageData.percentage / 100) * 175.9} 175.9`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {stageData.percentage}%
              </div>
            </div>
            <div>
              <div className="font-bold">{stageData.name}</div>
              <div className="text-2xl font-bold">{stageData.value}</div>
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 18: Split Design */}
      <TooltipCard title="58. Split Design" variant="split-design">
        <div className="flex min-w-64 overflow-hidden rounded-lg bg-white shadow-md">
          <div
            className="w-2"
            style={{ backgroundColor: stageData.color }}
          ></div>
          <div className="flex-1 p-4">
            <div className="mb-1 font-bold">{stageData.name}</div>
            <div className="mb-1 text-2xl font-bold">{stageData.value}</div>
            <div className="text-sm text-gray-500">
              {stageData.percentage}% du total
            </div>
          </div>
          <div
            className="flex w-16 items-center justify-center"
            style={{ backgroundColor: `${stageData.color}10` }}
          >
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 19: Accent Corner */}
      <TooltipCard title="59. Accent Corner" variant="accent-corner">
        <div className="relative min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div
            className="absolute top-0 right-0 h-0 w-0 border-t-[40px] border-r-[40px] border-b-0 border-l-0"
            style={{
              borderTopColor: stageData.color,
              borderRightColor: stageData.color
            }}
          ></div>
          <div className="absolute top-2 right-2 text-white">
            {stageData.icon}
          </div>
          <div className="pr-8">
            <div className="mb-1 font-bold">{stageData.name}</div>
            <div className="mb-1 text-2xl font-bold">{stageData.value}</div>
            <div className="text-sm text-gray-500">
              {stageData.percentage}% du total
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 20: Boxed Stat */}
      <TooltipCard title="60. Boxed Stat" variant="boxed-stat">
        <div className="min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div className="mb-3 flex items-center space-x-3">
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
            <div className="font-bold">{stageData.name}</div>
          </div>
          <div className="rounded-lg bg-gray-100 p-3 text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: stageData.color }}
            >
              {stageData.value}
            </div>
            <div className="text-sm text-gray-500">
              {stageData.percentage}% du total
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 21: Horizontal Layout */}
      <TooltipCard title="61. Horizontal Layout" variant="horizontal-layout">
        <div className="flex min-w-64 items-center justify-between rounded-lg bg-white p-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: stageData.color }}
            >
              {stageData.icon}
            </div>
            <div>
              <div className="font-bold">{stageData.name}</div>
              <div className="text-sm text-gray-500">
                {stageData.percentage}%
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">{stageData.value}</div>
        </div>
      </TooltipCard>

      {/* Card 22: Dotted Border */}
      <TooltipCard title="62. Dotted Border" variant="dotted-border">
        <div
          className="min-w-64 rounded-lg bg-white p-4 shadow-sm"
          style={{ border: `2px dotted ${stageData.color}` }}
        >
          <div className="text-center">
            <div className="mb-1 text-lg font-bold">{stageData.name}</div>
            <div
              className="text-3xl font-bold"
              style={{ color: stageData.color }}
            >
              {stageData.value}
            </div>
            <div className="text-sm text-gray-500">
              {stageData.percentage}% du total
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 23: Accent Background */}
      <TooltipCard title="63. Accent Background" variant="accent-background">
        <div className="min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div
            className="mb-3 rounded-lg p-3"
            style={{ backgroundColor: `${stageData.color}15` }}
          >
            <div className="flex items-center space-x-2">
              <div style={{ color: stageData.color }}>{stageData.icon}</div>
              <div className="font-bold">{stageData.name}</div>
            </div>
          </div>
          <div className="text-2xl font-bold">{stageData.value}</div>
          <div className="text-sm text-gray-500">
            {stageData.percentage}% du total
          </div>
        </div>
      </TooltipCard>

      {/* Card 24: Minimal Card */}
      <TooltipCard title="64. Minimal Card" variant="minimal-card">
        <div className="min-w-64 rounded-lg bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-medium">{stageData.name}</div>
            <div className="text-lg font-bold">{stageData.value}</div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 25: Stacked Layout */}
      <TooltipCard title="65. Stacked Layout" variant="stacked-layout">
        <div className="min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-bold">{stageData.name}</div>
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
          </div>
          <div className="mb-2 flex items-end space-x-2">
            <div className="text-3xl font-bold">{stageData.value}</div>
            <div className="text-sm text-gray-500">/ {stageData.total}</div>
          </div>
          <div className="h-1 w-full rounded-full bg-gray-200">
            <div
              className="h-1 rounded-full"
              style={{
                width: `${stageData.percentage}%`,
                backgroundColor: stageData.color
              }}
            ></div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 26: Accent Icon */}
      <TooltipCard title="66. Accent Icon" variant="accent-icon">
        <div className="min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <div className="font-bold">{stageData.name}</div>
              <div className="text-2xl font-bold">{stageData.value}</div>
            </div>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: stageData.color }}
            >
              {stageData.icon}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {stageData.percentage}% du total
          </div>
        </div>
      </TooltipCard>

      {/* Card 27: Dashed Progress */}
      <TooltipCard title="67. Dashed Progress" variant="dashed-progress">
        <div className="min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div className="mb-3 flex items-center space-x-2">
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
            <div className="font-bold">{stageData.name}</div>
          </div>
          <div className="mb-2 text-2xl font-bold">{stageData.value}</div>
          <div className="relative h-2 w-full rounded-full bg-gray-200">
            <div
              className="absolute top-0 left-0 h-2 rounded-full"
              style={{
                width: `${stageData.percentage}%`,
                backgroundColor: stageData.color,
                backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 5px, ${stageData.color}80 5px, ${stageData.color}80 10px)`
              }}
            ></div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 28: Accent Divider */}
      <TooltipCard title="68. Accent Divider" variant="accent-divider">
        <div className="min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div className="mb-2 flex items-center space-x-2">
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
            <div className="font-bold">{stageData.name}</div>
          </div>
          <div
            className="mb-2 h-0.5 w-full"
            style={{ backgroundColor: stageData.color }}
          ></div>
          <div className="text-2xl font-bold">{stageData.value}</div>
          <div className="text-sm text-gray-500">
            {stageData.percentage}% du total
          </div>
        </div>
      </TooltipCard>

      {/* Card 29: Rounded Icon */}
      <TooltipCard title="69. Rounded Icon" variant="rounded-icon">
        <div className="min-w-64 rounded-lg bg-white p-4 shadow-md">
          <div className="mb-3 flex items-center space-x-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${stageData.color}20`,
                color: stageData.color
              }}
            >
              {stageData.icon}
            </div>
            <div>
              <div className="font-bold">{stageData.name}</div>
              <div className="text-sm text-gray-500">
                {stageData.percentage}%
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">{stageData.value}</div>
        </div>
      </TooltipCard>

      {/* Card 30: Subtle Shadow */}
      <TooltipCard title="70. Subtle Shadow" variant="subtle-shadow">
        <div
          className="min-w-64 rounded-lg bg-white p-4"
          style={{ boxShadow: `0 4px 20px ${stageData.color}20` }}
        >
          <div className="text-center">
            <div
              className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${stageData.color}15`,
                color: stageData.color
              }}
            >
              {stageData.icon}
            </div>
            <div className="mb-1 font-bold">{stageData.name}</div>
            <div
              className="text-2xl font-bold"
              style={{ color: stageData.color }}
            >
              {stageData.value}
            </div>
            <div className="text-sm text-gray-500">
              {stageData.percentage}% du total
            </div>
          </div>
        </div>
      </TooltipCard>
    </div>
  );
}
