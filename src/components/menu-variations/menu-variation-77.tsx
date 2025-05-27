'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation77: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [springActive, setSpringActive] = useState(false);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      color: 'from-purple-500 to-violet-600'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      color: 'from-pink-500 to-rose-600'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      color: 'from-green-500 to-emerald-600'
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
      setSpringActive(true);
      setActiveTab(newTab);
      setTimeout(() => setSpringActive(false), 800);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-white via-gray-50 to-white p-1">
        <div className="bg-white/95 backdrop-blur-sm px-4 py-4 relative overflow-hidden">
          {/* Indicateur avec physique de ressort */}
          <div
            className={cn(
              'absolute bottom-2 h-1 rounded-full transition-all ease-out',
              `bg-gradient-to-r ${tabs[activeTab].color}`,
              springActive ? 'duration-800' : 'duration-500'
            )}
            style={{
              left: `${activeTab * 25 + 12.5}%`,
              width: '12.5%',
              transform: 'translateX(-50%)',
              transitionTimingFunction: springActive
                ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                : 'ease-out'
            }}
          />

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
                    'relative mb-2 transition-all ease-out transform',
                    'group-hover:scale-105 group-active:scale-95',
                    activeTab === index ? 'scale-110' : '',
                    springActive && index === activeTab
                      ? 'duration-800'
                      : 'duration-300'
                  )}
                  style={{
                    transitionTimingFunction:
                      springActive && index === activeTab
                        ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        : 'ease-out'
                  }}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all transform relative',
                      'group-hover:rotate-6',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200',
                      springActive && index === activeTab
                        ? 'duration-800'
                        : 'duration-300'
                    )}
                    style={{
                      transitionTimingFunction:
                        springActive && index === activeTab
                          ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                          : 'ease-out'
                    }}
                  >
                    {tab.icon}
                  </div>
                </div>

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-300 relative',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                      : 'text-gray-600 group-hover:text-gray-800'
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
