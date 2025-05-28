'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation30: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '🎪'
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
      emoji: '💖'
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
      <div className="relative bg-gradient-to-t from-purple-700 via-pink-600 to-purple-500">
        {/* Effets spéciaux */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 animate-ping rounded-full bg-white/30 opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: '2s'
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
                {activeTab === index && (
                  <div className="absolute -inset-2 animate-pulse rounded-2xl bg-gradient-to-r from-purple-300/40 via-white/40 to-purple-300/40 blur-sm" />
                )}

                <div
                  className={cn(
                    'mb-2 transform rounded-2xl border-2 p-3 transition-all duration-300',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'border-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white shadow-2xl shadow-purple-500/50'
                      : 'border-purple-600 bg-purple-800 text-purple-200 hover:bg-purple-700'
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
                      ? 'animate-pulse text-white'
                      : 'text-purple-200'
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
