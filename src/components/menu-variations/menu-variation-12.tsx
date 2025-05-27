'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation12: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [debris, setDebris] = useState<
    Array<{ id: number; x: number; y: number; rotation: number; speed: number }>
  >([]);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      emoji: '🌪️'
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
      emoji: '🌩️'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      emoji: '💨'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Génération de débris tourbillonnants
  useEffect(() => {
    const generateDebris = () => {
      const newDebris = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 80,
        rotation: Math.random() * 360,
        speed: Math.random() * 3 + 1
      }));
      setDebris(newDebris);
    };

    generateDebris();
    const interval = setInterval(generateDebris, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden overflow-hidden">
      <div className="relative bg-gradient-to-t from-gray-800 via-gray-600 to-gray-400">
        {/* Débris tourbillonnants */}
        {debris.map(item => (
          <div
            key={item.id}
            className="absolute w-2 h-2 bg-gray-300 opacity-60"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `rotate(${item.rotation}deg)`,
              animation: `spin ${item.speed}s linear infinite, float ${item.speed * 2}s ease-in-out infinite`
            }}
          />
        ))}

        {/* Éclairs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="absolute bg-white opacity-80 animate-ping"
              style={{
                left: `${30 + i * 20}%`,
                top: '20%',
                width: '2px',
                height: '40px',
                animationDelay: `${i * 0.8}s`,
                animationDuration: '0.3s',
                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))',
                clipPath:
                  'polygon(50% 0%, 40% 30%, 60% 30%, 45% 60%, 55% 60%, 50% 100%)'
              }}
            />
          ))}
        </div>

        {/* Tourbillons */}
        <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="absolute bottom-0 border-4 border-gray-400 border-t-transparent rounded-full animate-spin opacity-40"
              style={{
                left: `${25 + i * 50}%`,
                width: '60px',
                height: '60px',
                animationDuration: `${1 + i * 0.5}s`,
                transform: 'translateX(-50%)'
              }}
            />
          ))}
        </div>

        <div className="relative px-4 py-4 bg-black/40 backdrop-blur-lg">
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
                {/* Aura de tempête */}
                {activeTab === index && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-400/40 via-white/40 to-gray-400/40 rounded-2xl animate-pulse blur-sm" />
                )}

                <div
                  className={cn(
                    'mb-2 p-3 rounded-2xl transition-all duration-300 transform border-2',
                    'hover:rotate-180 hover:scale-110',
                    activeTab === index
                      ? 'bg-gradient-to-r from-gray-500 via-white to-gray-500 text-gray-800 shadow-2xl shadow-gray-500/50 border-white'
                      : 'bg-gray-700 text-gray-300 border-gray-500 hover:bg-gray-600'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div
                    className="absolute -top-3 -right-3 text-2xl animate-spin"
                    style={{ animationDuration: '2s' }}
                  >
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-300 uppercase tracking-wider',
                    activeTab === index
                      ? 'text-white animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'text-gray-300'
                  )}
                >
                  {tab.name}
                </span>

                {/* Particules de vent */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-1 left-0 w-1 h-1 bg-white rounded-full animate-ping opacity-75" />
                    <div
                      className="absolute top-2 right-1 w-0.5 h-0.5 bg-gray-300 rounded-full animate-ping opacity-75"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="absolute bottom-1 left-2 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Effet de brouillard */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-600/50 to-transparent blur-sm" />
      </div>
    </nav>
  );
};
