'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation6: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '❄️'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      emoji: '🔍'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      emoji: '💎'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      emoji: '✨'
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
      <div className="relative bg-gradient-to-t from-blue-900 via-cyan-600 to-blue-300">
        {/* Cristaux de glace */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-pulse bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
          />
        ))}

        <div className="relative border-t border-white/20 bg-white/10 px-4 py-4 backdrop-blur-lg">
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
                {/* Aura glacée */}
                {activeTab === index && (
                  <div className="absolute -inset-2 animate-pulse rounded-2xl bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-purple-400/30 blur-sm" />
                )}

                <div
                  className={cn(
                    'mb-2 transform rounded-2xl border-2 p-3 transition-all duration-500',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'border-white bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-white shadow-2xl shadow-cyan-500/50'
                      : 'border-cyan-300/50 bg-white/20 text-cyan-100 hover:bg-white/30'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div className="absolute -top-2 -right-2 animate-bounce text-2xl">
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? 'animate-pulse text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]'
                      : 'text-cyan-100'
                  )}
                >
                  {tab.name}
                </span>

                {/* Particules de glace */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-1 left-1 h-1 w-1 animate-ping rounded-full bg-cyan-300 opacity-75" />
                    <div
                      className="absolute top-1 right-1 h-1 w-1 animate-ping rounded-full bg-blue-300 opacity-75"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <div
                      className="absolute bottom-1 left-1 h-1 w-1 animate-ping rounded-full bg-purple-300 opacity-75"
                      style={{ animationDelay: '0.6s' }}
                    />
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
