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
      icon: <Home className="w-5 h-5" />,
      href: '/',
      plasma: 'from-electric-blue-400 to-cyan-500'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      plasma: 'from-purple-400 to-violet-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      plasma: 'from-pink-400 to-red-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 p-1">
        <div className="bg-black/85 backdrop-blur-xl px-4 py-4 relative overflow-hidden">
          {/* Décharges électriques de fond */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="absolute w-px h-8 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg) scale(${1 + Math.sin(plasmaEnergy * 0.1 + i) * 0.5})`
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-around relative z-10">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className="flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 relative group"
              >
                <div
                  className={cn(
                    'relative mb-2 transition-all duration-500 ease-out transform',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-115' : ''
                  )}
                >
                  {/* Champ plasma */}
                  <div
                    className={cn(
                      'absolute inset-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full',
                      'border-2 border-dashed transition-all duration-1000',
                      activeTab === index
                        ? 'border-cyan-400 opacity-60 animate-spin'
                        : 'border-gray-600 opacity-20'
                    )}
                    style={{ animationDuration: '4s' }}
                  />

                  {/* Noyau énergétique */}
                  <div
                    className={cn(
                      'relative z-10 w-14 h-14 rounded-full transition-all duration-500 transform',
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
                            'opacity-40 animate-pulse blur-sm'
                          )}
                        />
                        <div
                          className={cn(
                            'absolute inset-2 rounded-full transition-all duration-700',
                            `bg-gradient-to-r ${tab.plasma}`,
                            'opacity-60 animate-ping'
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
                            'absolute top-0 left-1/2 w-px h-4 -translate-x-1/2 -translate-y-full',
                            `bg-gradient-to-t ${tab.plasma}`,
                            'animate-pulse opacity-80'
                          )}
                          style={{ animationDelay: '0s' }}
                        />
                        <div
                          className={cn(
                            'absolute bottom-0 right-1/4 w-px h-3 translate-y-full',
                            `bg-gradient-to-b ${tab.plasma}`,
                            'animate-pulse opacity-60'
                          )}
                          style={{ animationDelay: '0.3s' }}
                        />
                        <div
                          className={cn(
                            'absolute left-0 top-1/3 w-3 h-px -translate-x-full',
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
                          'absolute -top-1 -left-1 w-1 h-1 rounded-full animate-ping',
                          `bg-gradient-to-r ${tab.plasma}`
                        )}
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className={cn(
                          'absolute -bottom-1 -right-1 w-0.5 h-0.5 rounded-full animate-ping',
                          `bg-gradient-to-r ${tab.plasma}`
                        )}
                        style={{ animationDelay: '0.5s' }}
                      />
                      <div
                        className={cn(
                          'absolute top-1 -right-1 w-0.5 h-0.5 rounded-full animate-ping',
                          `bg-gradient-to-r ${tab.plasma}`
                        )}
                        style={{ animationDelay: '1s' }}
                      />
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-500 relative',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.plasma} bg-clip-text text-transparent animate-pulse`
                      : 'text-gray-400 group-hover:text-gray-300'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 rounded-full',
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
