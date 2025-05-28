'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation5: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [flames, setFlames] = useState<
    Array<{ id: number; x: number; delay: number; height: number }>
  >([]);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '🔥'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      emoji: '⚡'
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
      emoji: '🌟'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Génération de flammes
  useEffect(() => {
    const generateFlames = () => {
      const newFlames = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        height: Math.random() * 20 + 10
      }));
      setFlames(newFlames);
    };

    generateFlames();
    const interval = setInterval(generateFlames, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 overflow-hidden md:hidden">
      {/* Background de feu */}
      <div className="relative bg-gradient-to-t from-red-900 via-orange-600 to-yellow-500">
        {/* Flammes animées */}
        {flames.map(flame => (
          <div
            key={flame.id}
            className="absolute bottom-0 animate-pulse bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 opacity-70"
            style={{
              left: `${flame.x}%`,
              width: '4px',
              height: `${flame.height}px`,
              animationDelay: `${flame.delay}s`,
              animationDuration: '1.5s',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
            }}
          />
        ))}

        {/* Particules de braise */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 animate-ping rounded-full bg-yellow-300 opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        <div className="relative bg-black/20 px-4 py-4 backdrop-blur-sm">
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
                {/* Aura de feu pour l'onglet actif */}
                {activeTab === index && (
                  <>
                    <div className="absolute -inset-2 animate-pulse rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-30 blur-sm" />
                    <div className="absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 opacity-50 blur-xs" />
                  </>
                )}

                {/* Icône avec effet de braise */}
                <div
                  className={cn(
                    'relative mb-2 transform rounded-2xl border-2 p-3 transition-all duration-300',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'scale-110 border-yellow-300 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white shadow-2xl shadow-orange-500/50'
                      : 'border-red-600 bg-gradient-to-r from-red-800 to-orange-800 text-orange-200 hover:border-orange-500'
                  )}
                >
                  {tab.icon}

                  {/* Étincelles autour de l'icône active */}
                  {activeTab === index && (
                    <>
                      <div className="absolute -top-1 -left-1 h-2 w-2 animate-ping rounded-full bg-yellow-300 opacity-75" />
                      <div
                        className="absolute -top-1 -right-1 h-1 w-1 animate-ping rounded-full bg-orange-300 opacity-75"
                        style={{ animationDelay: '0.3s' }}
                      />
                      <div
                        className="absolute -bottom-1 -left-1 h-1 w-1 animate-ping rounded-full bg-red-300 opacity-75"
                        style={{ animationDelay: '0.6s' }}
                      />
                      <div
                        className="absolute -right-1 -bottom-1 h-1.5 w-1.5 animate-ping rounded-full bg-yellow-400 opacity-75"
                        style={{ animationDelay: '0.9s' }}
                      />
                    </>
                  )}
                </div>

                {/* Emoji de feu */}
                {activeTab === index && (
                  <div className="absolute -top-2 -right-2 animate-bounce text-2xl">
                    {tab.emoji}
                  </div>
                )}

                {/* Label avec effet de lueur */}
                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-300',
                    activeTab === index
                      ? 'animate-pulse text-yellow-100 drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]'
                      : 'text-orange-200'
                  )}
                >
                  {tab.name}
                </span>

                {/* Flammes miniatures autour de l'onglet actif */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-0 left-0 h-3 w-1 animate-pulse rounded-full bg-gradient-to-t from-red-500 to-yellow-400 opacity-80" />
                    <div
                      className="absolute top-0 right-0 h-2 w-1 animate-pulse rounded-full bg-gradient-to-t from-orange-500 to-yellow-300 opacity-80"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <div
                      className="absolute bottom-0 left-1 h-2 w-0.5 animate-pulse rounded-full bg-gradient-to-t from-red-400 to-orange-300 opacity-80"
                      style={{ animationDelay: '1s' }}
                    />
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Lueur de base */}
        <div className="absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-red-600/50 to-transparent blur-sm" />
      </div>
    </nav>
  );
};
