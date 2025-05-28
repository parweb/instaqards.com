'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation8: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '🚀'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      emoji: '🛸'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      emoji: '🌟'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      emoji: '🌌'
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
      <div className="relative bg-gradient-to-t from-purple-900 via-indigo-800 to-blue-900">
        {/* Étoiles scintillantes */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-ping rounded-full bg-white opacity-80"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: '2s'
            }}
          />
        ))}

        <div className="relative border-t border-purple-500/50 bg-black/30 px-4 py-4 backdrop-blur-lg">
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
                {/* Aura spatiale */}
                {activeTab === index && (
                  <div className="absolute -inset-3 animate-pulse rounded-2xl bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 blur-md" />
                )}

                <div
                  className={cn(
                    'mb-2 transform rounded-2xl border-2 p-3 transition-all duration-500',
                    'hover:scale-110 hover:rotate-180',
                    activeTab === index
                      ? 'border-cyan-300 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white shadow-2xl shadow-purple-500/50'
                      : 'border-purple-500/50 bg-gray-800 text-purple-300 hover:bg-gray-700'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div className="absolute -top-4 -right-4 animate-bounce text-2xl">
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold tracking-wider uppercase transition-all duration-500',
                    activeTab === index
                      ? 'animate-pulse text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]'
                      : 'text-purple-300'
                  )}
                >
                  {tab.name}
                </span>

                {/* Particules cosmiques */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-0 left-0 h-1 w-1 animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <div
                      className="absolute top-0 right-0 h-1 w-1 animate-ping rounded-full bg-purple-400 opacity-75"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <div
                      className="absolute bottom-0 left-0 h-1 w-1 animate-ping rounded-full bg-blue-400 opacity-75"
                      style={{ animationDelay: '1s' }}
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
