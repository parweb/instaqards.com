'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation68: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [crystalGrowth, setCrystalGrowth] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      crystal: 'from-blue-300 via-cyan-200 to-blue-400'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      crystal: 'from-purple-300 via-pink-200 to-purple-400'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      crystal: 'from-red-300 via-orange-200 to-red-400'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      crystal: 'from-green-300 via-emerald-200 to-green-400'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCrystalGrowth(prev => prev + 1);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100 p-1">
        <div className="relative overflow-hidden bg-white/90 px-4 py-4 backdrop-blur-sm">
          {/* Formations cristallines de fond */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute bg-gradient-to-br from-blue-200 to-purple-200"
                style={{
                  width: `${4 + Math.random() * 8}px`,
                  height: `${8 + Math.random() * 16}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  transform: `rotate(${crystalGrowth * 2 + i * 45}deg) scale(${1 + Math.sin(crystalGrowth * 0.1 + i) * 0.3})`
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-center px-3 py-2"
              >
                <div
                  className={cn(
                    'relative mb-2 transform transition-all duration-700 ease-out',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-115' : ''
                  )}
                >
                  {/* Cristal principal */}
                  <div
                    className={cn(
                      'relative z-10 h-14 w-14 transform transition-all duration-500',
                      'group-hover:rotate-12',
                      activeTab === index ? 'shadow-2xl' : 'shadow-lg'
                    )}
                    style={{
                      clipPath:
                        'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
                      background: `linear-gradient(135deg, ${activeTab === index ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)'}, transparent, rgba(255,255,255,0.5))`
                    }}
                  >
                    {/* Facettes cristallines */}
                    <div
                      className={cn(
                        'absolute inset-0 transition-all duration-1000',
                        `bg-gradient-to-br ${tab.crystal}`,
                        activeTab === index
                          ? 'opacity-60'
                          : 'opacity-30 group-hover:opacity-40'
                      )}
                      style={{
                        clipPath:
                          'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)'
                      }}
                    />

                    {/* Reflets cristallins */}
                    <div
                      className="absolute top-2 left-3 h-6 w-2 rotate-12 transform bg-white/80"
                      style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)'
                      }}
                    />
                    <div
                      className="absolute top-3 right-3 h-4 w-1 -rotate-12 transform bg-white/60"
                      style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%)'
                      }}
                    />

                    {/* Icône au centre */}
                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center transition-all duration-500',
                        activeTab === index
                          ? 'text-gray-700'
                          : 'text-gray-600 group-hover:text-gray-700'
                      )}
                    >
                      {tab.icon}
                    </div>

                    {/* Scintillements */}
                    {activeTab === index && (
                      <>
                        <div
                          className={cn(
                            'absolute top-1 left-2 h-1 w-1 animate-ping rounded-full bg-white',
                            crystalGrowth % 3 === 0
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        <div
                          className={cn(
                            'absolute right-2 bottom-2 h-0.5 w-0.5 animate-ping rounded-full bg-white',
                            crystalGrowth % 3 === 1
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        <div
                          className={cn(
                            'absolute top-3 right-1 h-0.5 w-0.5 animate-ping rounded-full bg-white',
                            crystalGrowth % 3 === 2
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </>
                    )}
                  </div>

                  {/* Cristaux satellites */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-2 -left-1 h-4 w-3 transition-all duration-1000',
                          `bg-gradient-to-br ${tab.crystal}`,
                          'opacity-70'
                        )}
                        style={{
                          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                          transform: `rotate(${crystalGrowth * 3}deg)`
                        }}
                      />
                      <div
                        className={cn(
                          'absolute -right-2 -bottom-1 h-3 w-2 transition-all duration-1000',
                          `bg-gradient-to-br ${tab.crystal}`,
                          'opacity-70'
                        )}
                        style={{
                          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                          transform: `rotate(${-crystalGrowth * 2}deg)`
                        }}
                      />
                      <div
                        className={cn(
                          'absolute top-0 -right-1 h-2 w-1.5 transition-all duration-1000',
                          `bg-gradient-to-br ${tab.crystal}`,
                          'opacity-70'
                        )}
                        style={{
                          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                          transform: `rotate(${crystalGrowth * 4}deg)`
                        }}
                      />
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    'relative text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.crystal} animate-pulse bg-clip-text text-transparent`
                      : 'text-gray-600 group-hover:text-gray-700'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 transform',
                        `bg-gradient-to-r ${tab.crystal}`
                      )}
                      style={{
                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
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
