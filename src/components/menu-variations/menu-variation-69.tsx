'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation69: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [plasmaEnergy, setPlasmaEnergy] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      plasma: 'from-electric-blue-400 to-cyan-500'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      plasma: 'from-purple-400 to-violet-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      plasma: 'from-pink-400 to-red-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      plasma: 'from-yellow-400 to-orange-500'
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
      setPlasmaEnergy(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 p-1">
        <div className="relative overflow-hidden bg-black/85 px-4 py-4 backdrop-blur-xl">
          {/* Décharges électriques de fond */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="absolute h-8 w-px animate-pulse bg-gradient-to-b from-cyan-400 to-transparent"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg) scale(${1 + Math.sin(plasmaEnergy * 0.1 + i) * 0.5})`
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
                    'relative mb-2 transform transition-all duration-500 ease-out',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-115' : ''
                  )}
                >
                  {/* Champ plasma */}
                  <div
                    className={cn(
                      'absolute inset-0 top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full',
                      'border-2 border-dashed transition-all duration-1000',
                      activeTab === index
                        ? 'animate-spin border-cyan-400 opacity-60'
                        : 'border-gray-600 opacity-20'
                    )}
                    style={{ animationDuration: '4s' }}
                  />

                  {/* Noyau énergétique */}
                  <div
                    className={cn(
                      'relative z-10 h-14 w-14 transform rounded-full transition-all duration-500',
                      'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
                      'border-2 group-hover:rotate-45',
                      activeTab === index
                        ? 'border-cyan-400 shadow-2xl'
                        : 'border-gray-600 group-hover:border-gray-500'
                    )}
                  >
                    {/* Plasma intérieur */}
                    {activeTab === index && (
                      <>
                        <div
                          className={cn(
                            'absolute inset-1 rounded-full transition-all duration-500',
                            `bg-gradient-to-r ${tab.plasma}`,
                            'animate-pulse opacity-40 blur-sm'
                          )}
                        />
                        <div
                          className={cn(
                            'absolute inset-2 rounded-full transition-all duration-700',
                            `bg-gradient-to-r ${tab.plasma}`,
                            'animate-ping opacity-60'
                          )}
                        />
                      </>
                    )}

                    {/* Icône avec effet plasma */}
                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center transition-all duration-500',
                        activeTab === index
                          ? 'text-cyan-200'
                          : 'text-gray-400 group-hover:text-gray-300'
                      )}
                    >
                      {tab.icon}
                    </div>

                    {/* Arcs électriques */}
                    {activeTab === index && (
                      <>
                        <div
                          className={cn(
                            'absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 -translate-y-full',
                            `bg-gradient-to-t ${tab.plasma}`,
                            'animate-pulse opacity-80'
                          )}
                          style={{ animationDelay: '0s' }}
                        />
                        <div
                          className={cn(
                            'absolute right-1/4 bottom-0 h-3 w-px translate-y-full',
                            `bg-gradient-to-b ${tab.plasma}`,
                            'animate-pulse opacity-60'
                          )}
                          style={{ animationDelay: '0.3s' }}
                        />
                        <div
                          className={cn(
                            'absolute top-1/3 left-0 h-px w-3 -translate-x-full',
                            `bg-gradient-to-l ${tab.plasma}`,
                            'animate-pulse opacity-70'
                          )}
                          style={{ animationDelay: '0.6s' }}
                        />
                      </>
                    )}
                  </div>

                  {/* Particules d'énergie */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-1 -left-1 h-1 w-1 animate-ping rounded-full',
                          `bg-gradient-to-r ${tab.plasma}`
                        )}
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className={cn(
                          'absolute -right-1 -bottom-1 h-0.5 w-0.5 animate-ping rounded-full',
                          `bg-gradient-to-r ${tab.plasma}`
                        )}
                        style={{ animationDelay: '0.5s' }}
                      />
                      <div
                        className={cn(
                          'absolute top-1 -right-1 h-0.5 w-0.5 animate-ping rounded-full',
                          `bg-gradient-to-r ${tab.plasma}`
                        )}
                        style={{ animationDelay: '1s' }}
                      />
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    'relative text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.plasma} animate-pulse bg-clip-text text-transparent`
                      : 'text-gray-400 group-hover:text-gray-300'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 transform rounded-full',
                        `bg-gradient-to-r ${tab.plasma}`,
                        'animate-pulse'
                      )}
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
