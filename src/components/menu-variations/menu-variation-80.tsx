'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation80: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [microInteraction, setMicroInteraction] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      color: 'from-rose-500 to-pink-600'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      color: 'from-amber-500 to-orange-600'
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
      setMicroInteraction(true);
      setActiveTab(newTab);
      setTimeout(() => setMicroInteraction(false), 800);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-white via-gray-50 to-white p-1">
        <div className="bg-white/95 backdrop-blur-lg px-4 py-4 relative overflow-hidden">
          {/* Indicateur avec physique avancée */}
          <div
            className={cn(
              'absolute bottom-2 h-1 rounded-full transition-all',
              `bg-gradient-to-r ${tabs[activeTab].color}`,
              microInteraction ? 'duration-800' : 'duration-600'
            )}
            style={{
              left: `${activeTab * 25 + 8}%`,
              width: '9%',
              transform: 'translateX(-50%)',
              transitionTimingFunction: microInteraction
                ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          />

          {/* Indicateur de hover */}
          {hoveredTab !== null && hoveredTab !== activeTab && (
            <div
              className="absolute bottom-2 h-0.5 bg-gray-300 rounded-full transition-all duration-300 ease-out"
              style={{
                left: `${hoveredTab * 25 + 8}%`,
                width: '9%',
                transform: 'translateX(-50%)'
              }}
            />
          )}

          <div className="flex items-center justify-around relative z-10">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => handleTabChange(index)}
                onMouseEnter={() => setHoveredTab(index)}
                onMouseLeave={() => setHoveredTab(null)}
                className="flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 relative group"
              >
                <div
                  className={cn(
                    'relative mb-2 transition-all ease-out transform',
                    'group-hover:scale-105 group-active:scale-95',
                    activeTab === index ? 'scale-110' : '',
                    microInteraction && index === activeTab
                      ? 'duration-800'
                      : 'duration-300'
                  )}
                  style={{
                    transitionTimingFunction:
                      microInteraction && index === activeTab
                        ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                        : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                >
                  {/* Micro-animation de fond */}
                  <div
                    className={cn(
                      'absolute inset-0 w-14 h-14 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full transition-all duration-300',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} opacity-10`
                        : hoveredTab === index
                          ? 'bg-gray-200 opacity-50'
                          : 'opacity-0'
                    )}
                  />

                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all transform relative z-10',
                      'group-hover:rotate-3',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200',
                      microInteraction && index === activeTab
                        ? 'duration-800'
                        : 'duration-300'
                    )}
                    style={{
                      transitionTimingFunction:
                        microInteraction && index === activeTab
                          ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                          : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    {tab.icon}

                    {/* Micro-pulsation */}
                    {activeTab === index && (
                      <div
                        className={cn(
                          'absolute inset-0 rounded-2xl transition-all duration-1000',
                          `bg-gradient-to-r ${tab.color}`,
                          microInteraction
                            ? 'animate-pulse opacity-30'
                            : 'opacity-0'
                        )}
                      />
                    )}
                  </div>

                  {/* Particules micro */}
                  {microInteraction && index === activeTab && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full animate-bounce',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{
                          animationDelay: '0s',
                          animationDuration: '0.8s'
                        }}
                      />
                      <div
                        className={cn(
                          'absolute -bottom-1 -left-1 w-1 h-1 rounded-full animate-bounce',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{
                          animationDelay: '0.2s',
                          animationDuration: '0.8s'
                        }}
                      />
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    'text-xs font-bold transition-all relative',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                      : 'text-gray-600 group-hover:text-gray-800',
                    microInteraction && index === activeTab
                      ? 'duration-800'
                      : 'duration-300'
                  )}
                  style={{
                    transitionTimingFunction:
                      microInteraction && index === activeTab
                        ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                        : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                >
                  {tab.name}

                  {/* Micro-soulignement */}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full transition-all',
                        `bg-gradient-to-r ${tab.color}`,
                        microInteraction
                          ? 'w-8 duration-800'
                          : 'w-6 duration-300'
                      )}
                      style={{
                        transitionTimingFunction: microInteraction
                          ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                          : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    />
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
