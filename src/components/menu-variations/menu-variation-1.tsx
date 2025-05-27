'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation1: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
    { name: 'Search', icon: <Search className="w-5 h-5" />, href: '/explore' },
    { name: 'Likes', icon: <Heart className="w-5 h-5" />, href: '/qards' },
    { name: 'More', icon: <MoreHorizontal className="w-5 h-5" />, href: '#' }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background avec dégradé arc-en-ciel */}
      <div className="bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400 p-1 rounded-t-3xl">
        <div className="bg-white/90 backdrop-blur-lg rounded-t-3xl px-4 py-3">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-500 min-w-0 flex-1 relative transform',
                  'hover:scale-110 active:scale-95',
                  activeTab === index ? 'scale-110' : ''
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Indicateur actif avec dégradé */}
                {activeTab === index && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-400 to-purple-400 rounded-full animate-pulse" />
                )}

                {/* Icône avec dégradé de fond */}
                <div
                  className={cn(
                    'mb-1 p-3 rounded-2xl transition-all duration-500 transform',
                    'hover:rotate-12 hover:scale-110',
                    activeTab === index
                      ? 'bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 text-white shadow-2xl animate-bounce'
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
                      ? 'bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent animate-pulse'
                      : 'text-gray-600'
                  )}
                >
                  {tab.name}
                </span>

                {/* Particules flottantes pour l'onglet actif */}
                {activeTab === index && (
                  <>
                    <div
                      className="absolute top-0 left-0 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-75"
                      style={{ animationDelay: '0s' }}
                    />
                    <div
                      className="absolute top-2 right-0 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-75"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <div
                      className="absolute bottom-0 left-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping opacity-75"
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
