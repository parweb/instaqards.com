'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation86: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [matrix, setMatrix] = useState(false);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'from-purple-400 to-pink-400'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'from-red-400 to-orange-400'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      color: 'from-green-400 to-teal-400'
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
      const el = tabRefs.current[activeTab];
      if (el) {
        const rect = el.getBoundingClientRect();
        const parentRect = el.parentElement?.getBoundingClientRect();
        if (parentRect) {
          setIndicator({
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

  const handleTabChange = (index: number) => {
    if (index !== activeTab) {
      setMatrix(true);
      setActiveTab(index);
      setTimeout(() => setMatrix(false), 1500);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-1">
        <div className="relative overflow-hidden bg-black/95 px-4 py-4 backdrop-blur-lg">
          {/* Matrice de points de fond */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 20 }, (_, col) => (
                <div
                  key={`${row}-${col}`}
                  className="absolute h-1 w-1 rounded-full bg-gray-600"
                  style={{
                    left: `${(col / 19) * 100}%`,
                    top: `${(row / 7) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))
            )}
          </div>

          {/* Indicateur avec matrice animée */}
          {indicator && (
            <>
              <div
                className={cn(
                  'absolute bottom-6 h-1 rounded-full transition-all duration-700',
                  `bg-gradient-to-r ${tabs[activeTab].color}`
                )}
                style={{
                  left: indicator.left,
                  width: indicator.width
                }}
              />
              {/* Matrice illuminée */}
              {matrix && (
                <div
                  className="absolute top-0 bottom-0"
                  style={{
                    left: indicator.left - 10,
                    width: indicator.width + 20
                  }}
                >
                  {Array.from({ length: 6 }, (_, row) =>
                    Array.from({ length: 8 }, (_, col) => (
                      <div
                        key={`matrix-${row}-${col}`}
                        className={cn(
                          'absolute h-1.5 w-1.5 rounded-full transition-all duration-300',
                          `bg-gradient-to-r ${tabs[activeTab].color}`
                        )}
                        style={{
                          left: `${(col / 7) * 100}%`,
                          top: `${(row / 5) * 100}%`,
                          transform: 'translate(-50%, -50%)',
                          animationDelay: `${(row + col) * 0.05}s`,
                          opacity: matrix ? 1 : 0,
                          animation: matrix ? 'pulse 0.8s ease-in-out' : 'none'
                        }}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}

          <div className="relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                ref={el => {
                  tabRefs.current[index] = el;
                }}
                className="flex flex-1 flex-col items-center"
              >
                <Link
                  href={tab.href}
                  onClick={() => handleTabChange(index)}
                  className="group relative flex w-full min-w-0 flex-col items-center justify-center px-3 py-2"
                >
                  <div
                    className={cn(
                      'relative mb-2 transform transition-all duration-300 ease-out',
                      'group-hover:scale-110 group-active:scale-95',
                      activeTab === index ? 'scale-110' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'relative flex h-12 w-12 transform items-center justify-center rounded-2xl transition-all duration-500',
                        'group-hover:rotate-3',
                        activeTab === index
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                          : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'
                      )}
                    >
                      {tab.icon}

                      {/* Matrice de points sur l'icône active */}
                      {activeTab === index && (
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                          {Array.from({ length: 4 }, (_, row) =>
                            Array.from({ length: 4 }, (_, col) => (
                              <div
                                key={`icon-matrix-${row}-${col}`}
                                className={cn(
                                  'absolute h-1 w-1 rounded-full bg-white/30',
                                  matrix ? 'animate-pulse' : ''
                                )}
                                style={{
                                  left: `${20 + (col / 3) * 60}%`,
                                  top: `${20 + (row / 3) * 60}%`,
                                  transform: 'translate(-50%, -50%)',
                                  animationDelay: `${(row + col) * 0.1}s`
                                }}
                              />
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'relative text-xs font-bold transition-all duration-300',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                        : 'text-gray-400 group-hover:text-gray-300'
                    )}
                  >
                    {tab.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
