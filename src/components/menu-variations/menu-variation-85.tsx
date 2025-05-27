'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation85: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [splash, setSplash] = useState(false);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      color: 'from-blue-400 to-cyan-400',
      splashColor: 'bg-blue-400'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      color: 'from-purple-400 to-pink-400',
      splashColor: 'bg-purple-400'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      color: 'from-red-400 to-orange-400',
      splashColor: 'bg-red-400'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      color: 'from-green-400 to-teal-400',
      splashColor: 'bg-green-400'
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
      setSplash(true);
      setActiveTab(index);
      setTimeout(() => setSplash(false), 1200);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-1">
        <div className="bg-black/90 backdrop-blur-lg px-4 py-4 relative overflow-hidden">
          {/* Indicateur de base */}
          {indicator && (
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
          )}

          <div className="flex items-center justify-around relative z-10">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                ref={el => {
                  tabRefs.current[index] = el;
                }}
                className="flex-1 flex flex-col items-center"
              >
                <Link
                  href={tab.href}
                  onClick={() => handleTabChange(index)}
                  className="flex flex-col items-center justify-center px-3 py-2 min-w-0 w-full relative group"
                >
                  <div
                    className={cn(
                      'relative mb-2 transition-all duration-300 ease-out transform',
                      'group-hover:scale-110 group-active:scale-95',
                      activeTab === index ? 'scale-110' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 transform relative',
                        'group-hover:rotate-3',
                        activeTab === index
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                          : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'
                      )}
                    >
                      {tab.icon}

                      {/* Éclaboussures de couleur */}
                      {splash && activeTab === index && (
                        <>
                          {Array.from({ length: 12 }, (_, i) => (
                            <div
                              key={i}
                              className={cn(
                                'absolute w-2 h-2 rounded-full',
                                tab.splashColor,
                                'animate-ping'
                              )}
                              style={{
                                left: `${50 + Math.cos((i / 12) * 2 * Math.PI) * 25}%`,
                                top: `${50 + Math.sin((i / 12) * 2 * Math.PI) * 25}%`,
                                animationDelay: `${i * 0.05}s`,
                                animationDuration: '0.8s',
                                transform: 'translate(-50%, -50%)',
                                opacity: 0.8
                              }}
                            />
                          ))}
                          {/* Éclaboussures plus grandes */}
                          {Array.from({ length: 8 }, (_, i) => (
                            <div
                              key={`large-${i}`}
                              className={cn(
                                'absolute w-3 h-3 rounded-full',
                                tab.splashColor,
                                'animate-bounce'
                              )}
                              style={{
                                left: `${50 + Math.cos((i / 8) * 2 * Math.PI) * 35}%`,
                                top: `${50 + Math.sin((i / 8) * 2 * Math.PI) * 35}%`,
                                animationDelay: `${i * 0.08}s`,
                                animationDuration: '1s',
                                transform: 'translate(-50%, -50%)',
                                opacity: 0.6
                              }}
                            />
                          ))}
                          {/* Vague de couleur centrale */}
                          <div
                            className={cn(
                              'absolute inset-0 rounded-2xl',
                              `bg-gradient-to-r ${tab.color}`,
                              'animate-pulse opacity-30'
                            )}
                            style={{
                              animationDuration: '0.6s'
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-bold transition-all duration-300 relative',
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
