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
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'from-purple-500 to-violet-600'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'from-pink-500 to-rose-600'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
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
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-white via-gray-50 to-white p-1">
        <div className="relative overflow-hidden bg-white/95 px-4 py-4 backdrop-blur-sm">
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

          <div className="relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => handleTabChange(index)}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-center px-3 py-2"
              >
                <div
                  className={cn(
                    'relative mb-2 transform transition-all ease-out',
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
                      'relative flex h-12 w-12 transform items-center justify-center rounded-2xl transition-all',
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
                    'relative text-xs font-bold transition-all duration-300',
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
