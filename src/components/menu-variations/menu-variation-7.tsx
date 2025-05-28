'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation7: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '🌸'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      emoji: '🎋'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      emoji: '💮'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      emoji: '🌺'
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
      <div className="relative bg-gradient-to-t from-pink-200 via-rose-100 to-pink-50">
        {/* Pétales qui tombent */}
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-bounce text-pink-400 opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: '4s'
            }}
          >
            🌸
          </div>
        ))}

        <div className="relative border-t-2 border-pink-300 bg-white/80 px-4 py-4 backdrop-blur-lg">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'relative flex min-w-0 flex-1 transform flex-col items-center justify-center rounded-3xl px-3 py-2 transition-all duration-700',
                  'hover:scale-110 active:scale-95',
                  activeTab === index ? 'scale-110' : ''
                )}
              >
                <div
                  className={cn(
                    'mb-2 transform rounded-3xl border-2 p-3 transition-all duration-700',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'border-pink-200 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white shadow-2xl shadow-pink-500/50'
                      : 'border-pink-200 bg-pink-100 text-pink-600 hover:bg-pink-200'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div
                    className="absolute -top-3 -right-3 animate-spin text-3xl"
                    style={{ animationDuration: '3s' }}
                  >
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-700',
                    activeTab === index
                      ? 'animate-pulse text-pink-600'
                      : 'text-pink-500'
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
