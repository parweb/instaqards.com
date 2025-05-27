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
      icon: <Home className="w-5 h-5" />,
      href: '/',
      emoji: '🔥'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      emoji: '⚡'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      emoji: '💥'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden overflow-hidden">
      {/* Background de feu */}
      <div className="relative bg-gradient-to-t from-red-900 via-orange-600 to-yellow-500">
        {/* Flammes animées */}
        {flames.map(flame => (
          <div
            key={flame.id}
            className="absolute bottom-0 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 opacity-70 animate-pulse"
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
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        <div className="relative px-4 py-4 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-300 min-w-0 flex-1 relative transform',
                  'hover:scale-110 active:scale-95',
                  activeTab === index ? 'scale-110' : ''
                )}
              >
                {/* Aura de feu pour l'onglet actif */}
                {activeTab === index && (
                  <>
                    <div className="absolute -inset-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl opacity-30 animate-pulse blur-sm" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 rounded-2xl opacity-50 animate-pulse blur-xs" />
                  </>
                )}

                {/* Icône avec effet de braise */}
                <div
                  className={cn(
                    'relative mb-2 p-3 rounded-2xl transition-all duration-300 transform border-2',
                    'hover:rotate-12 hover:scale-110',
                    activeTab === index
                      ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white shadow-2xl shadow-orange-500/50 scale-110 border-yellow-300'
                      : 'bg-gradient-to-r from-red-800 to-orange-800 text-orange-200 border-red-600 hover:border-orange-500'
                  )}
                >
                  {tab.icon}

                  {/* Étincelles autour de l'icône active */}
                  {activeTab === index && (
                    <>
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75" />
                      <div
                        className="absolute -top-1 -right-1 w-1 h-1 bg-orange-300 rounded-full animate-ping opacity-75"
                        style={{ animationDelay: '0.3s' }}
                      />
                      <div
                        className="absolute -bottom-1 -left-1 w-1 h-1 bg-red-300 rounded-full animate-ping opacity-75"
                        style={{ animationDelay: '0.6s' }}
                      />
                      <div
                        className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-75"
                        style={{ animationDelay: '0.9s' }}
                      />
                    </>
                  )}
                </div>

                {/* Emoji de feu */}
                {activeTab === index && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    {tab.emoji}
                  </div>
                )}

                {/* Label avec effet de lueur */}
                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-300',
                    activeTab === index
                      ? 'text-yellow-100 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]'
                      : 'text-orange-200'
                  )}
                >
                  {tab.name}
                </span>

                {/* Flammes miniatures autour de l'onglet actif */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-0 left-0 w-1 h-3 bg-gradient-to-t from-red-500 to-yellow-400 rounded-full animate-pulse opacity-80" />
                    <div
                      className="absolute top-0 right-0 w-1 h-2 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full animate-pulse opacity-80"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <div
                      className="absolute bottom-0 left-1 w-0.5 h-2 bg-gradient-to-t from-red-400 to-orange-300 rounded-full animate-pulse opacity-80"
                      style={{ animationDelay: '1s' }}
                    />
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Lueur de base */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-red-600/50 to-transparent blur-sm" />
      </div>
    </nav>
  );
};
