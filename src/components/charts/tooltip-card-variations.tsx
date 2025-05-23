'use client';

import type React from 'react';
import { TrendingUp, Bell, ImageIcon } from 'lucide-react';

interface TooltipCardProps {
  title: string;
  variant: string;
  children: React.ReactNode;
}

export function TooltipCard({ title, variant, children }: TooltipCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        {title}
      </h4>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

export default function TooltipCardVariations() {
  const stageData = {
    name: 'Délivré',
    icon: <ImageIcon className="w-5 h-5" />,
    value: 28,
    total: 39,
    color: '#3b82f6',
    percentage: 72,
    conversionRate: 72
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card 1: Minimal Clean */}
      <TooltipCard title="41. Minimal Clean" variant="minimal-clean">
        <div className="bg-white shadow-md rounded-lg p-4 min-w-64">
          <div className="flex items-center space-x-2 mb-2">
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
            <div className="font-medium">{stageData.name}</div>
          </div>
          <div className="text-2xl font-bold mb-1">{stageData.value}</div>
          <div className="text-sm text-gray-500">
            {stageData.percentage}% du total
          </div>
        </div>
      </TooltipCard>

      {/* Card 2: Gradient Border */}
      <TooltipCard title="42. Gradient Border" variant="gradient-border">
        <div
          className="bg-white p-4 rounded-lg min-w-64"
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
            <div className="text-lg font-bold mb-1">{stageData.name}</div>
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
        <div className="bg-gray-900 text-white p-4 rounded-lg min-w-64">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <div style={{ color: stageData.color }}>{stageData.icon}</div>
              <div className="font-medium">{stageData.name}</div>
            </div>
            <div className="text-sm" style={{ color: stageData.color }}>
              {stageData.percentage}%
            </div>
          </div>
          <div className="text-2xl font-bold mb-2">{stageData.value}</div>
          <div className="w-full bg-gray-800 h-1 rounded-full">
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
          className="bg-gray-100 p-4 rounded-xl min-w-64"
          style={{ boxShadow: '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff' }}
        >
          <div className="text-center mb-3">
            <div
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2"
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
            className="text-2xl font-bold text-center"
            style={{ color: stageData.color }}
          >
            {stageData.value}
          </div>
        </div>
      </TooltipCard>

      {/* Card 5: Floating Card */}
      <TooltipCard title="45. Floating Card" variant="floating-card">
        <div className="relative bg-white p-4 rounded-lg shadow-lg min-w-64 transform hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -top-3 -right-3 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            {stageData.percentage}%
          </div>
          <div className="flex items-center space-x-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
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
          className="bg-white p-4 border-l-4 rounded-r-lg shadow-md min-w-64"
          style={{ borderColor: stageData.color }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold">{stageData.name}</div>
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
          </div>
          <div className="text-3xl font-bold mb-1">{stageData.value}</div>
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500">
              {stageData.conversionRate}% de conversion
            </span>
          </div>
        </div>
      </TooltipCard>

      {/* Card 7: Rounded Corners */}
      <TooltipCard title="47. Rounded Corners" variant="rounded-corners">
        <div className="bg-white p-5 rounded-3xl shadow-md min-w-64">
          <div className="flex items-center space-x-3 mb-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
              style={{ backgroundColor: stageData.color }}
            >
              {stageData.icon}
            </div>
            <div>
              <div className="font-bold text-lg">{stageData.name}</div>
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
          className="p-4 rounded-lg text-white min-w-64"
          style={{
            background: `linear-gradient(135deg, ${stageData.color}, #8b5cf6)`
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="font-bold text-lg">{stageData.name}</div>
            <div className="bg-white/20 p-2 rounded-full">{stageData.icon}</div>
          </div>
          <div className="text-3xl font-bold mb-1">{stageData.value}</div>
          <div className="text-sm opacity-80">
            {stageData.percentage}% du total
          </div>
        </div>
      </TooltipCard>

      {/* Card 9: Minimal Stats */}
      <TooltipCard title="49. Minimal Stats" variant="minimal-stats">
        <div className="bg-white p-4 rounded-lg shadow-sm border min-w-64">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Total</div>
              <div className="text-lg font-bold">{stageData.total}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Actuel</div>
              <div
                className="text-lg font-bold"
                style={{ color: stageData.color }}
              >
                {stageData.value}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Taux</div>
              <div className="text-lg font-bold">{stageData.percentage}%</div>
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 10: Outlined */}
      <TooltipCard title="50. Outlined" variant="outlined">
        <div
          className="p-4 rounded-lg border-2 min-w-64"
          style={{ borderColor: stageData.color, color: stageData.color }}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">{stageData.icon}</div>
            <div className="font-bold text-lg mb-1">{stageData.name}</div>
            <div className="text-2xl font-bold">{stageData.value}</div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 11: Pill Shape */}
      <TooltipCard title="51. Pill Shape" variant="pill-shape">
        <div className="bg-white p-3 rounded-full shadow-md flex items-center space-x-3 min-w-64">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
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
        <div className="relative bg-white p-4 rounded-lg shadow-md min-w-64">
          <div
            className="absolute -top-2 -left-2 w-full h-full rounded-lg -z-10"
            style={{ backgroundColor: `${stageData.color}40` }}
          ></div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold">{stageData.name}</div>
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
          </div>
          <div className="text-2xl font-bold mb-1">{stageData.value}</div>
          <div className="text-sm text-gray-500">
            {stageData.percentage}% du total
          </div>
        </div>
      </TooltipCard>

      {/* Card 13: Minimalist Icon */}
      <TooltipCard title="53. Minimalist Icon" variant="minimalist-icon">
        <div className="bg-white p-4 rounded-lg shadow-sm min-w-64">
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
          className="bg-white p-4 rounded-lg shadow-md border-t-4 min-w-64"
          style={{ borderColor: stageData.color }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Bell className="w-5 h-5" style={{ color: stageData.color }} />
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
        <div className="bg-gray-100 p-3 rounded-lg min-w-64">
          <div className="flex justify-between items-center">
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden min-w-64">
          <div
            className="h-2"
            style={{ backgroundColor: stageData.color }}
          ></div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold">{stageData.name}</div>
              <div
                className="text-sm font-medium"
                style={{ color: stageData.color }}
              >
                {stageData.percentage}%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stageData.value}</div>
            <div className="text-sm text-gray-500">
              sur {stageData.total} total
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 17: Circular Progress */}
      <TooltipCard title="57. Circular Progress" variant="circular-progress">
        <div className="bg-white p-4 rounded-lg shadow-md min-w-64">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex min-w-64">
          <div
            className="w-2"
            style={{ backgroundColor: stageData.color }}
          ></div>
          <div className="flex-1 p-4">
            <div className="font-bold mb-1">{stageData.name}</div>
            <div className="text-2xl font-bold mb-1">{stageData.value}</div>
            <div className="text-sm text-gray-500">
              {stageData.percentage}% du total
            </div>
          </div>
          <div
            className="w-16 flex items-center justify-center"
            style={{ backgroundColor: `${stageData.color}10` }}
          >
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 19: Accent Corner */}
      <TooltipCard title="59. Accent Corner" variant="accent-corner">
        <div className="relative bg-white p-4 rounded-lg shadow-md min-w-64">
          <div
            className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-b-0 border-l-0"
            style={{
              borderTopColor: stageData.color,
              borderRightColor: stageData.color
            }}
          ></div>
          <div className="absolute top-2 right-2 text-white">
            {stageData.icon}
          </div>
          <div className="pr-8">
            <div className="font-bold mb-1">{stageData.name}</div>
            <div className="text-2xl font-bold mb-1">{stageData.value}</div>
            <div className="text-sm text-gray-500">
              {stageData.percentage}% du total
            </div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 20: Boxed Stat */}
      <TooltipCard title="60. Boxed Stat" variant="boxed-stat">
        <div className="bg-white p-4 rounded-lg shadow-md min-w-64">
          <div className="flex items-center space-x-3 mb-3">
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
            <div className="font-bold">{stageData.name}</div>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-center">
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
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between min-w-64">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
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
          className="bg-white p-4 rounded-lg shadow-sm min-w-64"
          style={{ border: `2px dotted ${stageData.color}` }}
        >
          <div className="text-center">
            <div className="text-lg font-bold mb-1">{stageData.name}</div>
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
        <div className="bg-white p-4 rounded-lg shadow-md min-w-64">
          <div
            className="p-3 rounded-lg mb-3"
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
        <div className="bg-white p-3 rounded-lg shadow-sm min-w-64">
          <div className="flex items-center justify-between">
            <div className="font-medium">{stageData.name}</div>
            <div className="text-lg font-bold">{stageData.value}</div>
          </div>
        </div>
      </TooltipCard>

      {/* Card 25: Stacked Layout */}
      <TooltipCard title="65. Stacked Layout" variant="stacked-layout">
        <div className="bg-white p-4 rounded-lg shadow-md min-w-64">
          <div className="flex justify-between items-center mb-3">
            <div className="font-bold">{stageData.name}</div>
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
          </div>
          <div className="flex items-end space-x-2 mb-2">
            <div className="text-3xl font-bold">{stageData.value}</div>
            <div className="text-sm text-gray-500">/ {stageData.total}</div>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full">
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
        <div className="bg-white p-4 rounded-lg shadow-md min-w-64">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-bold">{stageData.name}</div>
              <div className="text-2xl font-bold">{stageData.value}</div>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white"
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
        <div className="bg-white p-4 rounded-lg shadow-md min-w-64">
          <div className="flex items-center space-x-2 mb-3">
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
            <div className="font-bold">{stageData.name}</div>
          </div>
          <div className="text-2xl font-bold mb-2">{stageData.value}</div>
          <div className="w-full h-2 bg-gray-200 rounded-full relative">
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
        <div className="bg-white p-4 rounded-lg shadow-md min-w-64">
          <div className="flex items-center space-x-2 mb-2">
            <div style={{ color: stageData.color }}>{stageData.icon}</div>
            <div className="font-bold">{stageData.name}</div>
          </div>
          <div
            className="h-0.5 w-full mb-2"
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
        <div className="bg-white p-4 rounded-lg shadow-md min-w-64">
          <div className="flex items-center space-x-3 mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
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
          className="bg-white p-4 rounded-lg min-w-64"
          style={{ boxShadow: `0 4px 20px ${stageData.color}20` }}
        >
          <div className="text-center">
            <div
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2"
              style={{
                backgroundColor: `${stageData.color}15`,
                color: stageData.color
              }}
            >
              {stageData.icon}
            </div>
            <div className="font-bold mb-1">{stageData.name}</div>
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
