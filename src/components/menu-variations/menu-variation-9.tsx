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
      icon: <Home className="w-5 h-5" />,
      href: '/',
      emoji: '🎮'
    },
    {
      name: 'FIND',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      emoji: '🕹️'
    },
    {
      name: 'LIKE',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      emoji: '👾'
    },
    {
      name: 'MORE',
      icon: <MoreHorizontal className="w-5 h-5" />,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden overflow-hidden">
      <div
        className="relative bg-black border-t-4 border-green-400"
        style={{
          backgroundImage: `
          linear-gradient(90deg, #00ff00 50%, transparent 50%),
          linear-gradient(#00ff00 50%, transparent 50%)
        `,
          backgroundSize: '4px 4px',
          backgroundPosition: '0 0, 2px 2px'
        }}
      >
        <div className="relative px-4 py-4 bg-black/80">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'flex flex-col items-center justify-center px-2 py-2 transition-all duration-200 min-w-0 flex-1 relative transform',
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
                    'mb-2 p-3 transition-all duration-200 transform border-2',
                    'hover:rotate-12 hover:scale-110',
                    activeTab === index
                      ? 'bg-green-400 text-black shadow-lg border-yellow-400'
                      : 'bg-gray-800 text-green-400 border-green-400 hover:bg-gray-700'
                  )}
                  style={{
                    clipPath:
                      'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div className="absolute -top-3 -right-3 text-2xl animate-bounce">
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-200 font-mono uppercase tracking-wider',
                    activeTab === index
                      ? 'text-green-400 animate-pulse'
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
                    <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-400 animate-ping" />
                    <div
                      className="absolute top-1 right-1 w-1 h-1 bg-yellow-400 animate-ping"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="absolute bottom-1 left-1 w-1 h-1 bg-yellow-400 animate-ping"
                      style={{ animationDelay: '0.4s' }}
                    />
                    <div
                      className="absolute bottom-1 right-1 w-1 h-1 bg-yellow-400 animate-ping"
                      style={{ animationDelay: '0.6s' }}
                    />
                  </>
                )}
              </Link>
            ))}
          </div>

          {/* Score style rétro */}
          <div className="text-center mt-2">
            <span className="text-green-400 font-mono text-xs tracking-widest">
              SCORE: {String(activeTab * 1000).padStart(6, '0')}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
