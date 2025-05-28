'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation9: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'HOME',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '🎮'
    },
    {
      name: 'FIND',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      emoji: '🕹️'
    },
    {
      name: 'LIKE',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      emoji: '👾'
    },
    {
      name: 'MORE',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      emoji: '🎯'
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
      <div
        className="relative border-t-4 border-green-400 bg-black"
        style={{
          backgroundImage: `
          linear-gradient(90deg, #00ff00 50%, transparent 50%),
          linear-gradient(#00ff00 50%, transparent 50%)
        `,
          backgroundSize: '4px 4px',
          backgroundPosition: '0 0, 2px 2px'
        }}
      >
        <div className="relative bg-black/80 px-4 py-4">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'relative flex min-w-0 flex-1 transform flex-col items-center justify-center px-2 py-2 transition-all duration-200',
                  'hover:scale-110 active:scale-95',
                  activeTab === index ? 'scale-110' : ''
                )}
                style={{
                  imageRendering: 'pixelated'
                }}
              >
                {/* Bordure pixelisée */}
                <div
                  className={cn(
                    'mb-2 transform border-2 p-3 transition-all duration-200',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'border-yellow-400 bg-green-400 text-black shadow-lg'
                      : 'border-green-400 bg-gray-800 text-green-400 hover:bg-gray-700'
                  )}
                  style={{
                    clipPath:
                      'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
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
                    'font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200',
                    activeTab === index
                      ? 'animate-pulse text-green-400'
                      : 'text-green-500'
                  )}
                  style={{
                    textShadow:
                      activeTab === index ? '0 0 8px #00ff00' : 'none',
                    fontFamily: 'monospace'
                  }}
                >
                  {tab.name}
                </span>

                {/* Pixels clignotants */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-1 left-1 h-1 w-1 animate-ping bg-yellow-400" />
                    <div
                      className="absolute top-1 right-1 h-1 w-1 animate-ping bg-yellow-400"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="absolute bottom-1 left-1 h-1 w-1 animate-ping bg-yellow-400"
                      style={{ animationDelay: '0.4s' }}
                    />
                    <div
                      className="absolute right-1 bottom-1 h-1 w-1 animate-ping bg-yellow-400"
                      style={{ animationDelay: '0.6s' }}
                    />
                  </>
                )}
              </Link>
            ))}
          </div>

          {/* Score style rétro */}
          <div className="mt-2 text-center">
            <span className="font-mono text-xs tracking-widest text-green-400">
              SCORE: {String(activeTab * 1000).padStart(6, '0')}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
