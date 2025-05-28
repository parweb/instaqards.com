'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation63: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [quantumState, setQuantumState] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'from-blue-400 to-cyan-400',
      particles: 8
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'from-purple-400 to-pink-400',
      particles: 12
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'from-red-400 to-orange-400',
      particles: 10
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      color: 'from-green-400 to-teal-400',
      particles: 6
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
      setQuantumState(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const generateParticles = (count: number, tabIndex: number) => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360;
      const radius = 25 + Math.sin(quantumState + i) * 10;
      const x =
        Math.cos(((angle + quantumState * 45) * Math.PI) / 180) * radius;
      const y =
        Math.sin(((angle + quantumState * 45) * Math.PI) / 180) * radius;

      return (
        <div
          key={i}
          className={cn(
            'absolute h-1 w-1 rounded-full transition-all duration-2000 ease-in-out',
            `bg-gradient-to-r ${tabs[tabIndex].color}`,
            activeTab === tabIndex ? 'animate-pulse opacity-100' : 'opacity-40'
          )}
          style={{
            transform: `translate(${x}px, ${y}px) scale(${activeTab === tabIndex ? 1.5 : 1})`,
            animationDelay: `${i * 100}ms`,
            filter: activeTab === tabIndex ? 'blur(0px)' : 'blur(0.5px)'
          }}
        />
      );
    });
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      {/* Fond quantique */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-1">
        <div className="relative overflow-hidden bg-black/90 px-4 py-4 backdrop-blur-xl">
          {/* Champ quantique de fond */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'absolute h-px w-px animate-pulse rounded-full bg-white',
                  quantumState % 2 === 0 ? 'opacity-100' : 'opacity-30'
                )}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Ondes quantiques */}
          <div className="absolute inset-0 opacity-10">
            <div
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform',
                'h-32 w-32 rounded-full border border-cyan-400 transition-all duration-2000 ease-in-out',
                quantumState % 2 === 0
                  ? 'scale-150 opacity-20'
                  : 'scale-100 opacity-40'
              )}
            />
            <div
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform',
                'h-48 w-48 rounded-full border border-purple-400 transition-all duration-2000 ease-in-out',
                quantumState % 2 === 1
                  ? 'scale-125 opacity-30'
                  : 'scale-75 opacity-10'
              )}
            />
          </div>

          <div className="relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-center px-3 py-2"
              >
                {/* Champ de particules quantiques */}
                <div
                  className={cn(
                    'relative mb-2 transform transition-all duration-700 ease-out',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-120' : ''
                  )}
                >
                  {/* Particules orbitales */}
                  <div className="absolute inset-0 top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2">
                    {generateParticles(tab.particles, index)}
                  </div>

                  {/* Noyau quantique */}
                  <div
                    className={cn(
                      'relative z-10 h-12 w-12 transform rounded-full transition-all duration-500',
                      'group-hover:rotate-180',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} animate-pulse shadow-2xl`
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-gray-500 group-hover:to-gray-600'
                    )}
                  >
                    {/* Effet de superposition quantique */}
                    {activeTab === index && (
                      <>
                        <div
                          className={cn(
                            'absolute inset-0 rounded-full transition-all duration-1000',
                            `bg-gradient-to-r ${tab.color}`,
                            quantumState % 2 === 0
                              ? 'scale-150 opacity-60 blur-md'
                              : 'scale-100 opacity-30 blur-sm'
                          )}
                        />
                        <div
                          className={cn(
                            'absolute inset-0 rounded-full transition-all duration-1000',
                            `bg-gradient-to-r ${tab.color}`,
                            quantumState % 2 === 1
                              ? 'scale-125 opacity-40 blur-lg'
                              : 'scale-75 opacity-20 blur-xs'
                          )}
                        />
                      </>
                    )}

                    {/* Icône avec effet quantique */}
                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center text-white transition-all duration-500',
                        activeTab === index && quantumState % 3 === 0
                          ? 'opacity-50'
                          : 'opacity-100'
                      )}
                    >
                      {tab.icon}
                    </div>

                    {/* Anneaux d'énergie */}
                    {activeTab === index && (
                      <>
                        <div
                          className={cn(
                            'absolute inset-0 rounded-full border-2 transition-all duration-1000',
                            `border-gradient-to-r ${tab.color}`,
                            quantumState % 4 === 0
                              ? 'scale-150 opacity-60'
                              : 'scale-100 opacity-30'
                          )}
                          style={{ borderColor: 'currentColor' }}
                        />
                        <div
                          className={cn(
                            'absolute inset-0 rounded-full border transition-all duration-1000',
                            `border-gradient-to-r ${tab.color}`,
                            quantumState % 4 === 2
                              ? 'scale-200 opacity-40'
                              : 'scale-125 opacity-20'
                          )}
                          style={{ borderColor: 'currentColor' }}
                        />
                      </>
                    )}
                  </div>

                  {/* Téléportation quantique */}
                  {activeTab === index && quantumState % 3 === 1 && (
                    <>
                      <div
                        className={cn(
                          'absolute top-0 left-0 h-2 w-2 animate-ping rounded-full',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className={cn(
                          'absolute right-0 bottom-0 h-1.5 w-1.5 animate-ping rounded-full',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{ animationDelay: '0.3s' }}
                      />
                      <div
                        className={cn(
                          'absolute top-1/2 right-0 h-1 w-1 animate-ping rounded-full',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{ animationDelay: '0.6s' }}
                      />
                    </>
                  )}
                </div>

                {/* Label avec effet quantique */}
                <span
                  className={cn(
                    'relative text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.color} animate-pulse bg-clip-text text-transparent`
                      : 'text-gray-400 group-hover:text-gray-200'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 transform rounded-full transition-all duration-1000',
                          `bg-gradient-to-r ${tab.color}`,
                          quantumState % 2 === 0
                            ? 'scale-x-100 opacity-100'
                            : 'scale-x-150 opacity-60'
                        )}
                      />
                      {quantumState % 4 === 3 && (
                        <div
                          className={cn(
                            'absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 transform animate-ping rounded-full',
                            `bg-gradient-to-r ${tab.color}`
                          )}
                        />
                      )}
                    </>
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
