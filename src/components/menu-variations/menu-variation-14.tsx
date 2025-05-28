'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation14: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '🏜️'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      emoji: '🌵'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      emoji: '☀️'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      emoji: '🐪'
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
      <div className="relative bg-gradient-to-t from-yellow-800 via-orange-400 to-yellow-300">
        {/* Dunes de sable */}
        <div className="absolute bottom-0 left-0 h-full w-full">
          <svg
            className="absolute bottom-0 h-16 w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
              fill="rgba(245,158,11,0.6)"
              className="animate-pulse"
            />
          </svg>
          <svg
            className="absolute bottom-0 h-12 w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 C300,40 600,80 900,40 C1050,60 1150,20 1200,40 L1200,120 L0,120 Z"
              fill="rgba(217,119,6,0.4)"
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </svg>
        </div>

        {/* Mirages scintillants */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-pulse rounded-full bg-white/20 opacity-60"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + Math.random() * 40}%`,
                width: `${8 + Math.random() * 12}px`,
                height: `${4 + Math.random() * 6}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: '3s',
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>

        <div className="relative bg-orange-900/30 px-4 py-4 backdrop-blur-sm">
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
                {/* Aura de mirage */}
                {activeTab === index && (
                  <div className="absolute -inset-2 animate-pulse rounded-2xl bg-gradient-to-r from-yellow-300/40 via-orange-300/40 to-yellow-300/40 blur-sm" />
                )}

                <div
                  className={cn(
                    'mb-2 transform rounded-2xl border-2 p-3 transition-all duration-500',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'border-yellow-200 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-orange-900 shadow-2xl shadow-orange-500/50'
                      : 'border-orange-600 bg-orange-800 text-yellow-200 hover:bg-orange-700'
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
                      ? 'animate-pulse text-orange-900 drop-shadow-[0_0_8px_rgba(255,165,0,0.8)]'
                      : 'text-yellow-200'
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
