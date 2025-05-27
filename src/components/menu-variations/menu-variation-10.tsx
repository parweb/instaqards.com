'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation10: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: number; y: number; delay: number; size: number }>
  >([]);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      emoji: '🦄'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      emoji: '✨'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      emoji: '💖'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      emoji: '🌈'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Génération de paillettes
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 80,
        delay: Math.random() * 3,
        size: Math.random() * 3 + 1
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden overflow-hidden">
      <div className="relative bg-gradient-to-t from-pink-200 via-purple-200 via-blue-200 to-cyan-200">
        {/* Paillettes magiques */}
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute animate-ping opacity-70"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: '2s'
            }}
          >
            <div
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 rounded-full"
              style={{
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`
              }}
            />
          </div>
        ))}

        {/* Nuages pastel */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-2 left-1/4 w-16 h-8 bg-white/30 rounded-full blur-sm animate-pulse" />
          <div
            className="absolute top-4 right-1/4 w-12 h-6 bg-pink-200/40 rounded-full blur-sm animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-1 left-3/4 w-10 h-5 bg-purple-200/40 rounded-full blur-sm animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="relative px-4 py-4 bg-white/60 backdrop-blur-lg border-t-2 border-pink-300">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'flex flex-col items-center justify-center px-3 py-2 rounded-3xl transition-all duration-700 min-w-0 flex-1 relative transform',
                  'hover:scale-110 active:scale-95',
                  activeTab === index ? 'scale-110' : ''
                )}
              >
                {/* Aura magique */}
                {activeTab === index && (
                  <>
                    <div className="absolute -inset-3 bg-gradient-to-r from-pink-300/40 via-purple-300/40 via-blue-300/40 to-cyan-300/40 rounded-3xl animate-pulse blur-lg" />
                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-200/60 via-purple-200/60 via-blue-200/60 to-cyan-200/60 rounded-3xl animate-pulse blur-md" />
                  </>
                )}

                <div
                  className={cn(
                    'mb-2 p-3 rounded-3xl transition-all duration-700 transform border-2',
                    'hover:rotate-12 hover:scale-110',
                    activeTab === index
                      ? 'bg-gradient-to-r from-pink-300 via-purple-300 via-blue-300 to-cyan-300 text-white shadow-2xl shadow-pink-500/50 border-white'
                      : 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600 border-pink-200 hover:from-pink-200 hover:to-purple-200'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div className="absolute -top-4 -right-4 text-3xl animate-bounce">
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-700',
                    activeTab === index
                      ? 'text-purple-600 animate-pulse drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                      : 'text-purple-500'
                  )}
                >
                  {tab.name}
                </span>

                {/* Paillettes autour de l'onglet actif */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-0 left-0 text-pink-400 animate-ping opacity-75">
                      ✨
                    </div>
                    <div
                      className="absolute top-0 right-0 text-purple-400 animate-ping opacity-75"
                      style={{ animationDelay: '0.3s' }}
                    >
                      💫
                    </div>
                    <div
                      className="absolute bottom-0 left-0 text-blue-400 animate-ping opacity-75"
                      style={{ animationDelay: '0.6s' }}
                    >
                      ⭐
                    </div>
                    <div
                      className="absolute bottom-0 right-0 text-cyan-400 animate-ping opacity-75"
                      style={{ animationDelay: '0.9s' }}
                    >
                      🌟
                    </div>
                  </>
                )}
              </Link>
            ))}
          </div>

          {/* Message magique */}
          <div className="text-center mt-3">
            <span className="text-purple-500 font-bold text-xs tracking-wider animate-pulse">
              ✨ Magical Navigation ✨
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
