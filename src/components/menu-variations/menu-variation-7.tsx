'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation7: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      emoji: '🌸'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      emoji: '🎋'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      emoji: '💮'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      emoji: '🌺'
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
      <div className="relative bg-gradient-to-t from-pink-200 via-rose-100 to-pink-50">
        {/* Pétales qui tombent */}
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute text-pink-400 animate-bounce opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: '4s'
            }}
          >
            🌸
          </div>
        ))}

        <div className="relative px-4 py-4 bg-white/80 backdrop-blur-lg border-t-2 border-pink-300">
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
                <div
                  className={cn(
                    'mb-2 p-3 rounded-3xl transition-all duration-700 transform border-2',
                    'hover:rotate-12 hover:scale-110',
                    activeTab === index
                      ? 'bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white shadow-2xl shadow-pink-500/50 border-pink-200'
                      : 'bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200'
                  )}
                >
                  {tab.icon}
                </div>

                {activeTab === index && (
                  <div
                    className="absolute -top-3 -right-3 text-3xl animate-spin"
                    style={{ animationDuration: '3s' }}
                  >
                    {tab.emoji}
                  </div>
                )}

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-700',
                    activeTab === index
                      ? 'text-pink-600 animate-pulse'
                      : 'text-pink-500'
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
