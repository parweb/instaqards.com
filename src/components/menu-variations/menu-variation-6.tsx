'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation6: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      emoji: '❄️'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      emoji: '🔍'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      emoji: '💎'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      emoji: '✨'
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
      <div className="relative bg-gradient-to-t from-blue-900 via-cyan-600 to-blue-300">
        {/* Cristaux de glace */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
          />
        ))}

        <div className="relative px-4 py-4 bg-white/10 backdrop-blur-lg border-t border-white/20">
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
                {/* Aura glacée */}
                {activeTab === index && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-purple-400/30 rounded-2xl animate-pulse blur-sm" />
                )}

                <div
                  className={cn(
                    'mb-2 p-3 rounded-2xl transition-all duration-500 transform border-2',
                    'hover:rotate-12 hover:scale-110',
                    activeTab === index
                      ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-white shadow-2xl shadow-cyan-500/50 border-white'
                      : 'bg-white/20 text-cyan-100 border-cyan-300/50 hover:bg-white/30'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? 'text-white animate-pulse drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]'
                      : 'text-cyan-100'
                  )}
                >
                  {tab.name}
                </span>

                {/* Particules de glace */}
                {activeTab === index && (
                  <>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-75" />
                    <div
                      className="absolute top-1 right-1 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-75"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <div
                      className="absolute bottom-1 left-1 w-1 h-1 bg-purple-300 rounded-full animate-ping opacity-75"
                      style={{ animationDelay: '0.6s' }}
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
