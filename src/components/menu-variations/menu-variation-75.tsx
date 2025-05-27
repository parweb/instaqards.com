'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation75: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [trailActive, setTrailActive] = useState(false);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      color: 'from-violet-400 to-purple-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      color: 'from-rose-400 to-pink-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      color: 'from-amber-400 to-orange-500'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleTabChange = (newTab: number) => {
    if (newTab !== activeTab) {
      setTrailActive(true);
      setActiveTab(newTab);
      setTimeout(() => setTrailActive(false), 1000);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-1">
        <div className="bg-black/80 backdrop-blur-xl px-4 py-4 relative overflow-hidden">
          <div className="flex items-center justify-around relative z-10">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => handleTabChange(index)}
                className="flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 relative group"
              >
                <div
                  className={cn(
                    'relative mb-2 transition-all duration-500 ease-out transform',
                    'group-hover:scale-105 group-active:scale-95',
                    activeTab === index ? 'scale-110' : ''
                  )}
                >
                  {/* Traînée de particules */}
                  {trailActive && index === activeTab && (
                    <>
                      {Array.from({ length: 12 }, (_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'absolute w-1 h-1 rounded-full animate-ping',
                            `bg-gradient-to-r ${tab.color}`
                          )}
                          style={{
                            left: `${Math.random() * 60 - 30 + 24}px`,
                            top: `${Math.random() * 60 - 30 + 24}px`,
                            animationDelay: `${i * 0.05}s`,
                            animationDuration: '1s'
                          }}
                        />
                      ))}
                    </>
                  )}

                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 transform relative',
                      'group-hover:rotate-6',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl`
                        : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'
                    )}
                  >
                    {tab.icon}
                  </div>
                </div>

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-300 relative',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                      : 'text-gray-500 group-hover:text-gray-400'
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
