'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation2: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'cyan'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'pink'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'green'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      color: 'purple'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (!isMobile) return null;

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      cyan: {
        glow: isActive ? 'shadow-cyan-500/50 shadow-2xl' : '',
        bg: isActive ? 'bg-cyan-500' : 'bg-gray-800',
        text: isActive ? 'text-cyan-400' : 'text-gray-400',
        border: 'border-cyan-500',
        neon: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]'
      },
      pink: {
        glow: isActive ? 'shadow-pink-500/50 shadow-2xl' : '',
        bg: isActive ? 'bg-pink-500' : 'bg-gray-800',
        text: isActive ? 'text-pink-400' : 'text-gray-400',
        border: 'border-pink-500',
        neon: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]'
      },
      green: {
        glow: isActive ? 'shadow-green-500/50 shadow-2xl' : '',
        bg: isActive ? 'bg-green-500' : 'bg-gray-800',
        text: isActive ? 'text-green-400' : 'text-gray-400',
        border: 'border-green-500',
        neon: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]'
      },
      purple: {
        glow: isActive ? 'shadow-purple-500/50 shadow-2xl' : '',
        bg: isActive ? 'bg-purple-500' : 'bg-gray-800',
        text: isActive ? 'text-purple-400' : 'text-gray-400',
        border: 'border-purple-500',
        neon: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      {/* Background sombre avec bordure néon */}
      <div className="border-t-2 border-cyan-500 bg-black/95 shadow-[0_-5px_20px_rgba(6,182,212,0.3)] backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => {
              const colorClasses = getColorClasses(
                tab.color,
                activeTab === index
              );
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    'relative flex min-w-0 flex-1 transform flex-col items-center justify-center rounded-xl px-3 py-2 transition-all duration-300',
                    'hover:scale-110 active:scale-95',
                    activeTab === index ? 'scale-110' : ''
                  )}
                >
                  {/* Ligne néon en haut */}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -top-3 left-1/2 h-0.5 w-12 -translate-x-1/2 transform animate-pulse rounded-full',
                        `bg-${tab.color}-400`,
                        colorClasses.neon
                      )}
                    />
                  )}

                  {/* Icône avec effet néon */}
                  <div
                    className={cn(
                      'mb-2 transform rounded-xl border-2 p-3 transition-all duration-300',
                      'hover:scale-110 hover:rotate-6',
                      colorClasses.bg,
                      colorClasses.border,
                      activeTab === index
                        ? `${colorClasses.glow} ${colorClasses.neon} animate-pulse text-white`
                        : 'border-gray-700 text-gray-500 hover:border-gray-600'
                    )}
                  >
                    {tab.icon}
                  </div>

                  {/* Label avec effet néon */}
                  <span
                    className={cn(
                      'text-xs font-bold tracking-wider uppercase transition-all duration-300',
                      colorClasses.text,
                      activeTab === index ? 'animate-pulse' : ''
                    )}
                  >
                    {tab.name}
                  </span>

                  {/* Particules néon flottantes */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute top-1 left-1 h-1 w-1 animate-ping rounded-full opacity-75',
                          `bg-${tab.color}-400`
                        )}
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className={cn(
                          'absolute top-1 right-1 h-1 w-1 animate-ping rounded-full opacity-75',
                          `bg-${tab.color}-400`
                        )}
                        style={{ animationDelay: '0.3s' }}
                      />
                      <div
                        className={cn(
                          'absolute bottom-1 left-2 h-0.5 w-0.5 animate-ping rounded-full opacity-75',
                          `bg-${tab.color}-400`
                        )}
                        style={{ animationDelay: '0.6s' }}
                      />
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
