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
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '🦄'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      emoji: '✨'
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
    <nav className="fixed right-0 bottom-0 left-0 z-50 overflow-hidden md:hidden">
      <div className="relative bg-gradient-to-t from-pink-200 via-blue-200 via-purple-200 to-cyan-200">
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
              className="rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"
              style={{
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`
              }}
            />
          </div>
        ))}

        {/* Nuages pastel */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
          <div className="absolute top-2 left-1/4 h-8 w-16 animate-pulse rounded-full bg-white/30 blur-sm" />
          <div
            className="absolute top-4 right-1/4 h-6 w-12 animate-pulse rounded-full bg-pink-200/40 blur-sm"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-1 left-3/4 h-5 w-10 animate-pulse rounded-full bg-purple-200/40 blur-sm"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="relative border-t-2 border-pink-300 bg-white/60 px-4 py-4 backdrop-blur-lg">
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
                {/* Aura magique */}
                {activeTab === index && (
                  <>
                    <div className="absolute -inset-3 animate-pulse rounded-3xl bg-gradient-to-r from-pink-300/40 via-blue-300/40 via-purple-300/40 to-cyan-300/40 blur-lg" />
                    <div className="absolute -inset-2 animate-pulse rounded-3xl bg-gradient-to-r from-pink-200/60 via-blue-200/60 via-purple-200/60 to-cyan-200/60 blur-md" />
                  </>
                )}

                <div
                  className={cn(
                    'mb-2 transform rounded-3xl border-2 p-3 transition-all duration-700',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'border-white bg-gradient-to-r from-pink-300 via-blue-300 via-purple-300 to-cyan-300 text-white shadow-2xl shadow-pink-500/50'
                      : 'border-pink-200 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600 hover:from-pink-200 hover:to-purple-200'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div className="absolute -top-4 -right-4 animate-bounce text-3xl">
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-700',
                    activeTab === index
                      ? 'animate-pulse text-purple-600 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                      : 'text-purple-500'
                  )}
                >
                  {tab.name}
                </span>

                {/* Paillettes autour de l'onglet actif */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-0 left-0 animate-ping text-pink-400 opacity-75">
                      ✨
                    </div>
                    <div
                      className="absolute top-0 right-0 animate-ping text-purple-400 opacity-75"
                      style={{ animationDelay: '0.3s' }}
                    >
                      💫
                    </div>
                    <div
                      className="absolute bottom-0 left-0 animate-ping text-blue-400 opacity-75"
                      style={{ animationDelay: '0.6s' }}
                    >
                      ⭐
                    </div>
                    <div
                      className="absolute right-0 bottom-0 animate-ping text-cyan-400 opacity-75"
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
          <div className="mt-3 text-center">
            <span className="animate-pulse text-xs font-bold tracking-wider text-purple-500">
              ✨ Magical Navigation ✨
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
