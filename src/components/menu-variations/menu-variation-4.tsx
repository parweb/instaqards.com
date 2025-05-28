'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation4: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [bubbles, setBubbles] = useState<
    Array<{ id: number; x: number; delay: number; size: number }>
  >([]);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      emoji: '🏠'
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
      emoji: '💙'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      emoji: '🌊'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Génération de bulles
  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * 8 + 4
      }));
      setBubbles(newBubbles);
    };

    generateBubbles();
    const interval = setInterval(generateBubbles, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 overflow-hidden md:hidden">
      {/* Background océan avec vagues */}
      <div className="relative bg-gradient-to-t from-blue-900 via-blue-600 to-cyan-400">
        {/* Vagues animées */}
        <div className="absolute top-0 left-0 h-full w-full">
          <svg
            className="absolute top-0 h-8 w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.1)"
              className="animate-pulse"
            />
          </svg>
          <svg
            className="absolute top-2 h-8 w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 C400,20 800,100 1200,40 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.05)"
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </svg>
        </div>

        {/* Bulles flottantes */}
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="absolute bottom-0 animate-bounce rounded-full bg-white/20 opacity-60"
            style={{
              left: `${bubble.x}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationDelay: `${bubble.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}

        <div className="relative bg-white/10 px-4 py-4 backdrop-blur-lg">
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
                {/* Vague d'activation */}
                {activeTab === index && (
                  <div className="absolute -top-4 left-1/2 h-2 w-16 -translate-x-1/2 transform animate-pulse rounded-full bg-white/30">
                    <div className="absolute top-0 left-0 h-full w-full animate-ping rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  </div>
                )}

                {/* Icône avec effet aquatique */}
                <div
                  className={cn(
                    'mb-2 transform rounded-2xl border-2 border-white/30 p-3 transition-all duration-500',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'scale-110 animate-pulse border-white bg-white/90 text-blue-600 shadow-2xl shadow-blue-500/50'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  )}
                >
                  {tab.icon}
                </div>

                {/* Emoji flottant */}
                {activeTab === index && (
                  <div className="absolute top-0 right-0 animate-bounce text-lg">
                    {tab.emoji}
                  </div>
                )}

                {/* Label */}
                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? 'animate-pulse text-white text-shadow-lg'
                      : 'text-blue-100'
                  )}
                >
                  {tab.name}
                </span>

                {/* Bulles autour de l'onglet actif */}
                {activeTab === index && (
                  <>
                    <div
                      className="absolute top-1 left-1 h-2 w-2 animate-ping rounded-full bg-white/40"
                      style={{ animationDelay: '0s' }}
                    />
                    <div
                      className="absolute top-2 right-1 h-1 w-1 animate-ping rounded-full bg-white/40"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <div
                      className="absolute bottom-1 left-2 h-1.5 w-1.5 animate-ping rounded-full bg-white/40"
                      style={{ animationDelay: '1s' }}
                    />
                    <div
                      className="absolute right-2 bottom-2 h-1 w-1 animate-ping rounded-full bg-white/40"
                      style={{ animationDelay: '1.5s' }}
                    />
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Reflets de lumière sous-marine */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-full w-full">
          <div className="absolute bottom-0 left-1/4 h-32 w-32 animate-pulse rounded-full bg-white/5 blur-xl" />
          <div
            className="absolute right-1/4 bottom-0 h-24 w-24 animate-pulse rounded-full bg-cyan-300/10 blur-xl"
            style={{ animationDelay: '1s' }}
          />
        </div>
      </div>
    </nav>
  );
};
