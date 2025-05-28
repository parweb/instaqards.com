'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation3: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [bouncingTab, setBouncingTab] = useState<number | null>(null);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-6 w-6" />,
      href: '/',
      color: 'bg-red-500',
      shadow: 'shadow-red-500/50'
    },
    {
      name: 'Search',
      icon: <Search className="h-6 w-6" />,
      href: '/explore',
      color: 'bg-yellow-500',
      shadow: 'shadow-yellow-500/50'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-6 w-6" />,
      href: '/qards',
      color: 'bg-green-500',
      shadow: 'shadow-green-500/50'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-6 w-6" />,
      href: '#',
      color: 'bg-blue-500',
      shadow: 'shadow-blue-500/50'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Animation de rebond automatique
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTab = Math.floor(Math.random() * tabs.length);
      setBouncingTab(randomTab);
      setTimeout(() => setBouncingTab(null), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setBouncingTab(index);
    setTimeout(() => setBouncingTab(null), 1000);

    // Vibration festive
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  };

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      {/* Background rayé comme un chapiteau */}
      <div className="bg-gradient-to-r from-red-400 via-green-400 via-yellow-400 to-blue-400 p-2">
        <div className="rounded-3xl border-4 border-dashed border-purple-400 bg-white/95 px-4 py-4 backdrop-blur-lg">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => handleTabClick(index)}
                className={cn(
                  'relative flex min-w-0 flex-1 transform flex-col items-center justify-center rounded-3xl px-2 py-2 transition-all duration-300',
                  'hover:scale-125 active:scale-90',
                  activeTab === index ? 'scale-125' : '',
                  bouncingTab === index ? 'animate-bounce' : ''
                )}
                style={{
                  animationDuration: bouncingTab === index ? '0.6s' : undefined
                }}
              >
                {/* Confettis autour de l'onglet actif */}
                {activeTab === index && (
                  <>
                    <div className="absolute -top-2 -left-2 animate-spin text-2xl">
                      🎪
                    </div>
                    <div className="absolute -top-2 -right-2 animate-bounce text-2xl">
                      🎭
                    </div>
                    <div className="absolute -bottom-2 -left-2 animate-pulse text-2xl">
                      🎨
                    </div>
                    <div className="absolute -right-2 -bottom-2 animate-spin text-2xl">
                      🎯
                    </div>
                  </>
                )}

                {/* Icône avec style cirque */}
                <div
                  className={cn(
                    'mb-2 transform rounded-full border-4 border-white p-4 transition-all duration-500',
                    'hover:scale-110 hover:rotate-180',
                    tab.color,
                    tab.shadow,
                    activeTab === index
                      ? 'scale-110 animate-pulse text-white shadow-2xl'
                      : 'text-white hover:shadow-xl',
                    bouncingTab === index ? 'animate-bounce' : ''
                  )}
                >
                  {tab.icon}
                </div>

                {/* Label avec style festif */}
                <span
                  className={cn(
                    'text-xs font-black tracking-widest uppercase transition-all duration-300',
                    activeTab === index
                      ? 'animate-pulse text-sm text-purple-600'
                      : 'text-gray-700',
                    bouncingTab === index ? 'animate-bounce' : ''
                  )}
                >
                  {tab.name}
                </span>

                {/* Étoiles scintillantes */}
                {(activeTab === index || bouncingTab === index) && (
                  <>
                    <div className="absolute top-0 left-0 animate-ping text-yellow-400">
                      ⭐
                    </div>
                    <div
                      className="absolute top-0 right-0 animate-ping text-pink-400"
                      style={{ animationDelay: '0.2s' }}
                    >
                      ✨
                    </div>
                    <div
                      className="absolute bottom-0 left-0 animate-ping text-blue-400"
                      style={{ animationDelay: '0.4s' }}
                    >
                      💫
                    </div>
                    <div
                      className="absolute right-0 bottom-0 animate-ping text-green-400"
                      style={{ animationDelay: '0.6s' }}
                    >
                      🌟
                    </div>
                  </>
                )}
              </Link>
            ))}
          </div>

          {/* Ligne de points colorés en bas */}
          <div className="mt-3 flex justify-center space-x-2">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full transition-all duration-300',
                  activeTab === index
                    ? 'scale-150 animate-pulse bg-purple-500'
                    : 'bg-gray-300'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
