'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation1: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, href: '/' },
    { name: 'Search', icon: <Search className="h-5 w-5" />, href: '/explore' },
    { name: 'Likes', icon: <Heart className="h-5 w-5" />, href: '/qards' },
    { name: 'More', icon: <MoreHorizontal className="h-5 w-5" />, href: '#' }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      {/* Background avec dégradé arc-en-ciel */}
      <div className="rounded-t-3xl bg-gradient-to-r from-red-400 via-blue-400 via-green-400 via-indigo-400 via-yellow-400 to-purple-400 p-1">
        <div className="rounded-t-3xl bg-white/90 px-4 py-3 backdrop-blur-lg">
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
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Indicateur actif avec dégradé */}
                {activeTab === index && (
                  <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-red-400 to-purple-400" />
                )}

                {/* Icône avec dégradé de fond */}
                <div
                  className={cn(
                    'mb-1 transform rounded-2xl p-3 transition-all duration-500',
                    'hover:scale-110 hover:rotate-12',
                    activeTab === index
                      ? 'animate-bounce bg-gradient-to-r from-red-400 via-blue-400 via-green-400 via-yellow-400 to-purple-400 text-white shadow-2xl'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-red-200 hover:to-purple-200'
                  )}
                >
                  {tab.icon}
                </div>

                {/* Label avec couleur dégradée */}
                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? 'animate-pulse bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent'
                      : 'text-gray-600'
                  )}
                >
                  {tab.name}
                </span>

                {/* Particules flottantes pour l'onglet actif */}
                {activeTab === index && (
                  <>
                    <div
                      className="absolute top-0 left-0 h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75"
                      style={{ animationDelay: '0s' }}
                    />
                    <div
                      className="absolute top-2 right-0 h-1 w-1 animate-ping rounded-full bg-yellow-400 opacity-75"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <div
                      className="absolute bottom-0 left-2 h-1.5 w-1.5 animate-ping rounded-full bg-blue-400 opacity-75"
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
