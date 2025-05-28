'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation13: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '🎭'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      emoji: '🎪'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      emoji: '🎨'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      emoji: '🎬'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 overflow-hidden md:hidden">
      <div className="relative bg-gradient-to-t from-red-900 via-red-700 to-yellow-600">
        {/* Rideaux de théâtre */}
        <div
          className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-red-800 to-red-600 opacity-80"
          style={{ clipPath: 'polygon(0 0, 80% 0, 60% 100%, 0 100%)' }}
        />
        <div
          className="absolute top-0 right-0 h-full w-1/4 bg-gradient-to-l from-red-800 to-red-600 opacity-80"
          style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 40% 100%)' }}
        />

        {/* Projecteurs */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-pulse bg-yellow-200 opacity-30"
              style={{
                left: `${20 + i * 20}%`,
                top: '0%',
                width: '40px',
                height: '100%',
                clipPath: 'polygon(40% 0%, 60% 0%, 80% 100%, 20% 100%)',
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        <div className="relative bg-black/50 px-4 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'relative flex min-w-0 flex-1 transform flex-col items-center justify-center rounded-2xl px-3 py-2 transition-all duration-500',
                  'hover:scale-110 active:scale-95',
                  activeTab === index ? 'scale-110' : ''
                )}
              >
                {/* Projecteur sur l'onglet actif */}
                {activeTab === index && (
                  <div className="absolute -inset-4 animate-pulse rounded-full bg-yellow-200/20 blur-lg" />
                )}

                <div
                  className={cn(
                    'mb-2 transform rounded-2xl border-2 p-3 transition-all duration-500',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'border-yellow-300 bg-gradient-to-r from-yellow-400 via-red-500 to-red-600 text-white shadow-2xl shadow-red-500/50'
                      : 'border-red-600 bg-red-800 text-red-200 hover:bg-red-700'
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
                    'text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? 'animate-pulse text-yellow-100 drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]'
                      : 'text-red-200'
                  )}
                >
                  {tab.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
