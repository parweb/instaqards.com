'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation34: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      emoji: '🎨'
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
      emoji: '💖'
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
      <div className="relative bg-gradient-to-t from-purple-300 via-pink-300 to-blue-300">
        {/* Effets spéciaux */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-ping opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        <div className="relative px-4 py-4 bg-black/30 backdrop-blur-sm">
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
                {activeTab === index && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-300/40 via-white/40 to-purple-300/40 rounded-2xl animate-pulse blur-sm" />
                )}

                <div
                  className={cn(
                    'mb-2 p-3 rounded-2xl transition-all duration-300 transform border-2',
                    'hover:rotate-12 hover:scale-110',
                    activeTab === index
                      ? 'bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white shadow-2xl shadow-purple-500/50 border-white'
                      : 'bg-purple-800 text-purple-200 border-purple-600 hover:bg-purple-700'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div className="absolute -top-3 -right-3 text-2xl animate-bounce">
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-300',
                    activeTab === index
                      ? 'text-white animate-pulse'
                      : 'text-purple-200'
                  )}
                >
                  {tab.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
