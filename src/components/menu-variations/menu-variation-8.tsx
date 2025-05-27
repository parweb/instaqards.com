'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation8: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      emoji: '🚀'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      emoji: '🛸'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      emoji: '🌟'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      emoji: '🌌'
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
      <div className="relative bg-gradient-to-t from-purple-900 via-indigo-800 to-blue-900">
        {/* Étoiles scintillantes */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping opacity-80"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: '2s'
            }}
          />
        ))}

        <div className="relative px-4 py-4 bg-black/30 backdrop-blur-lg border-t border-purple-500/50">
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
              >
                {/* Aura spatiale */}
                {activeTab === index && (
                  <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 rounded-2xl animate-pulse blur-md" />
                )}

                <div
                  className={cn(
                    'mb-2 p-3 rounded-2xl transition-all duration-500 transform border-2',
                    'hover:rotate-180 hover:scale-110',
                    activeTab === index
                      ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white shadow-2xl shadow-purple-500/50 border-cyan-300'
                      : 'bg-gray-800 text-purple-300 border-purple-500/50 hover:bg-gray-700'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div className="absolute -top-4 -right-4 text-2xl animate-bounce">
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-500 uppercase tracking-wider',
                    activeTab === index
                      ? 'text-cyan-300 animate-pulse drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]'
                      : 'text-purple-300'
                  )}
                >
                  {tab.name}
                </span>

                {/* Particules cosmiques */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-0 left-0 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-75" />
                    <div
                      className="absolute top-0 right-0 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-75"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-75"
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
