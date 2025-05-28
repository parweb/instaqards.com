'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation11: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [lavaDrops, setLavaDrops] = useState<
    Array<{ id: number; x: number; delay: number; size: number }>
  >([]);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '🌋'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      emoji: '🔥'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      emoji: '💥'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      emoji: '⚡'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Génération de gouttes de lave
  useEffect(() => {
    const generateLava = () => {
      const newDrops = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * 6 + 3
      }));
      setLavaDrops(newDrops);
    };

    generateLava();
    const interval = setInterval(generateLava, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 overflow-hidden md:hidden">
      <div className="relative bg-gradient-to-t from-red-900 via-orange-700 to-yellow-600">
        {/* Gouttes de lave */}
        {lavaDrops.map(drop => (
          <div
            key={drop.id}
            className="absolute animate-bounce rounded-full bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 opacity-80"
            style={{
              left: `${drop.x}%`,
              top: '10%',
              width: `${drop.size}px`,
              height: `${drop.size}px`,
              animationDelay: `${drop.delay}s`,
              animationDuration: '2s',
              filter: 'drop-shadow(0 0 8px rgba(255, 165, 0, 0.8))'
            }}
          />
        ))}

        {/* Éruptions de lave */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-full w-full">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="absolute bottom-0 animate-pulse bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 opacity-60"
              style={{
                left: `${20 + i * 15}%`,
                width: '8px',
                height: `${Math.random() * 30 + 20}px`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '1.5s',
                borderRadius: '50% 50% 0 0'
              }}
            />
          ))}
        </div>

        <div className="relative bg-black/30 px-4 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'relative flex min-w-0 flex-1 transform flex-col items-center justify-center rounded-2xl px-3 py-2 transition-all duration-300',
                  'hover:scale-110 active:scale-95',
                  activeTab === index ? 'scale-110' : ''
                )}
              >
                {/* Aura volcanique */}
                {activeTab === index && (
                  <div className="absolute -inset-2 animate-pulse rounded-2xl bg-gradient-to-r from-red-500/40 via-orange-500/40 to-yellow-500/40 blur-sm" />
                )}

                <div
                  className={cn(
                    'mb-2 transform rounded-2xl border-2 p-3 transition-all duration-300',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'border-yellow-300 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white shadow-2xl shadow-orange-500/50'
                      : 'border-red-600 bg-gradient-to-r from-red-800 to-orange-800 text-orange-200 hover:border-orange-500'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div className="absolute -top-3 -right-3 animate-bounce text-2xl">
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-300',
                    activeTab === index
                      ? 'animate-pulse text-yellow-100 drop-shadow-[0_0_8px_rgba(255,165,0,0.8)]'
                      : 'text-orange-200'
                  )}
                >
                  {tab.name}
                </span>

                {/* Particules de braise volcanique */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-0 left-0 h-2 w-2 animate-ping rounded-full bg-yellow-400 opacity-75" />
                    <div
                      className="absolute top-1 right-0 h-1 w-1 animate-ping rounded-full bg-orange-400 opacity-75"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <div
                      className="absolute bottom-0 left-1 h-1.5 w-1.5 animate-ping rounded-full bg-red-400 opacity-75"
                      style={{ animationDelay: '0.6s' }}
                    />
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Lueur volcanique de base */}
        <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-red-700/60 to-transparent blur-md" />
      </div>
    </nav>
  );
};
