'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation89: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [radarActive, setRadarActive] = useState(false);
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
      color: 'from-blue-400 to-cyan-400'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      color: 'from-purple-400 to-pink-400'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      color: 'from-red-400 to-orange-400'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
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
      setRadarActive(true);
      setActiveTab(index);
      setTimeout(() => setRadarActive(false), 2000);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-1">
        <div className="bg-black/90 backdrop-blur-lg px-4 py-4 relative overflow-hidden">
          {/* Grille radar de fond */}
          <div className="absolute inset-0 opacity-10">
            {/* Lignes horizontales */}
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 h-px bg-green-400"
                style={{ top: `${(i / 4) * 100}%` }}
              />
            ))}
            {/* Lignes verticales */}
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 w-px bg-green-400"
                style={{ left: `${(i / 7) * 100}%` }}
              />
            ))}
          </div>

          {/* Indicateur principal */}
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

          {/* Ondes radar */}
          {radarActive && indicator && (
            <>
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'absolute rounded-full border-2 transition-all duration-1000 ease-out',
                    `border-${tabs[activeTab].color.split('-')[1]}-400`
                  )}
                  style={{
                    left: indicator.left + indicator.width / 2,
                    top: '50%',
                    width: `${(i + 1) * 60}px`,
                    height: `${(i + 1) * 60}px`,
                    transform: 'translate(-50%, -50%)',
                    opacity: radarActive ? 0.8 - i * 0.2 : 0,
                    animationDelay: `${i * 0.2}s`,
                    animation: radarActive
                      ? 'ping 2s ease-out infinite'
                      : 'none'
                  }}
                />
              ))}
              {/* Balayage radar */}
              <div
                className="absolute"
                style={{
                  left: indicator.left,
                  top: 0,
                  width: indicator.width,
                  height: '100%'
                }}
              >
                <div
                  className={cn(
                    'absolute w-full h-full',
                    `bg-gradient-to-r from-transparent via-${tabs[activeTab].color.split('-')[1]}-400/30 to-transparent`
                  )}
                  style={{
                    animation: radarActive ? 'sweep 2s ease-in-out' : 'none',
                    transformOrigin: 'center bottom'
                  }}
                />
              </div>
            </>
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

                      {/* Point radar pour l'onglet actif */}
                      {activeTab === index && (
                        <>
                          <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                          {/* Point central radar */}
                          <div
                            className={cn(
                              'absolute w-2 h-2 rounded-full animate-pulse',
                              `bg-${tab.color.split('-')[1]}-400`
                            )}
                            style={{
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                          {/* Cercles concentriques */}
                          {radarActive &&
                            Array.from({ length: 3 }, (_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'absolute rounded-full border animate-ping',
                                  `border-${tab.color.split('-')[1]}-400/50`
                                )}
                                style={{
                                  left: '50%',
                                  top: '50%',
                                  width: `${(i + 1) * 16}px`,
                                  height: `${(i + 1) * 16}px`,
                                  transform: 'translate(-50%, -50%)',
                                  animationDelay: `${i * 0.3}s`,
                                  animationDuration: '1.5s'
                                }}
                              />
                            ))}
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

      {/* Styles CSS pour les animations radar */}
      <style jsx>{`
        @keyframes sweep {
          0% {
            transform: rotate(-45deg) scaleX(0);
            opacity: 0;
          }
          50% {
            transform: rotate(0deg) scaleX(1);
            opacity: 1;
          }
          100% {
            transform: rotate(45deg) scaleX(0);
            opacity: 0;
          }
        }
      `}</style>
    </nav>
  );
};
