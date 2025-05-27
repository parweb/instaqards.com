'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation71: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLElement | null)[]>([]);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      color: 'from-green-500 to-teal-500'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const activeElement = tabRefs.current[activeTab];
      if (activeElement) {
        const rect = activeElement.getBoundingClientRect();
        const parentRect = activeElement.parentElement?.getBoundingClientRect();
        if (parentRect) {
          setIndicatorStyle({
            left: rect.left - parentRect.left,
            width: rect.width
          });
        }
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-white via-gray-50 to-white p-1">
        <div className="bg-white/95 backdrop-blur-sm px-4 py-4 relative overflow-hidden">
          {/* Indicateur mobile */}
          <div
            className={cn(
              'absolute bottom-6 h-1 bg-gradient-to-r transition-all duration-500 ease-out rounded-full',
              `${tabs[activeTab].color}`
            )}
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              transform: 'translateX(0px)'
            }}
          />

          {/* Indicateur de fond */}
          <div
            className={cn(
              'absolute bottom-2 h-12 bg-gradient-to-r transition-all duration-700 ease-out rounded-2xl opacity-10',
              `${tabs[activeTab].color}`
            )}
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`
            }}
          />

          <div className="flex items-center justify-around relative z-10">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                ref={el => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => setActiveTab(index)}
                className="flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 relative group"
              >
                {/* Icône avec micro-animations */}
                <div
                  className={cn(
                    'relative mb-2 transition-all duration-300 ease-out transform',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-110' : ''
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 transform',
                      'group-hover:rotate-3',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    )}
                  >
                    {tab.icon}

                    {/* Micro-animation de pulsation */}
                    {activeTab === index && (
                      <div
                        className={cn(
                          'absolute inset-0 rounded-2xl animate-ping opacity-30',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                      />
                    )}
                  </div>

                  {/* Particules de transition */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-1 -right-1 w-2 h-2 rounded-full animate-bounce',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className={cn(
                          'absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full animate-bounce',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{ animationDelay: '0.2s' }}
                      />
                    </>
                  )}
                </div>

                {/* Label avec animation */}
                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-300 relative',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                      : 'text-gray-600 group-hover:text-gray-800'
                  )}
                >
                  {tab.name}

                  {/* Micro-animation du texte */}
                  {activeTab === index && (
                    <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-current rounded-full animate-pulse" />
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
