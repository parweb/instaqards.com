'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation67: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [magneticPulse, setMagneticPulse] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      magnetic: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      magnetic: 'from-purple-500 to-violet-600'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      magnetic: 'from-red-500 to-pink-600'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      magnetic: 'from-green-500 to-emerald-600'
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
      setMagneticPulse(prev => prev + 1);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const generateMagneticParticles = (tabIndex: number) => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * 360;
      const distance = 30 + Math.sin(magneticPulse * 0.1 + i) * 10;
      const x =
        Math.cos(((angle + magneticPulse * 2) * Math.PI) / 180) * distance;
      const y =
        Math.sin(((angle + magneticPulse * 2) * Math.PI) / 180) * distance;

      return (
        <div
          key={i}
          className={cn(
            'absolute h-3 w-1 transition-all duration-300 ease-out',
            `bg-gradient-to-b ${tabs[tabIndex].magnetic}`,
            activeTab === tabIndex ? 'opacity-100' : 'opacity-40'
          )}
          style={{
            transform: `translate(${x}px, ${y}px) rotate(${angle + magneticPulse * 2}deg)`,
            borderRadius: '50%'
          }}
        />
      );
    });
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-800 via-slate-800 to-gray-800 p-1">
        <div className="relative overflow-hidden bg-gray-900/90 px-4 py-4 backdrop-blur-xl">
          {/* Lignes de champ magnétique */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                style={{
                  top: `${15 + i * 15}%`,
                  transform: `translateY(${Math.sin(magneticPulse * 0.05 + i) * 3}px)`
                }}
              />
            ))}
          </div>

          {/* Particules métalliques flottantes */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute h-2 w-0.5 rounded-full bg-gray-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${magneticPulse * 3 + i * 18}deg) translateY(${Math.sin(magneticPulse * 0.1 + i) * 2}px)`
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
                  {/* Champ magnétique */}
                  <div className="absolute inset-0 top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2">
                    {generateMagneticParticles(index)}
                  </div>

                  {/* Noyau magnétique */}
                  <div
                    className={cn(
                      'relative z-10 h-14 w-14 transform rounded-full transition-all duration-500',
                      'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800',
                      'border-2 group-hover:rotate-12',
                      activeTab === index
                        ? 'border-white shadow-2xl'
                        : 'border-gray-500 group-hover:border-gray-400'
                    )}
                  >
                    {/* Effet magnétique */}
                    {activeTab === index && (
                      <>
                        <div
                          className={cn(
                            'absolute inset-0 rounded-full transition-all duration-1000',
                            `bg-gradient-to-r ${tab.magnetic}`,
                            'animate-pulse opacity-20'
                          )}
                        />
                        <div
                          className={cn(
                            'absolute inset-2 rounded-full transition-all duration-1000',
                            `bg-gradient-to-r ${tab.magnetic}`,
                            'opacity-30'
                          )}
                        />
                      </>
                    )}

                    {/* Icône avec effet métallique */}
                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center transition-all duration-500',
                        activeTab === index
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-gray-300'
                      )}
                    >
                      {tab.icon}
                    </div>

                    {/* Anneaux magnétiques */}
                    {activeTab === index && (
                      <>
                        <div
                          className={cn(
                            'absolute inset-0 rounded-full border-2 transition-all duration-1000',
                            `border-gradient-to-r ${tab.magnetic}`,
                            'animate-ping opacity-60'
                          )}
                        />
                        <div
                          className={cn(
                            'absolute -inset-2 rounded-full border transition-all duration-1000',
                            `border-gradient-to-r ${tab.magnetic}`,
                            'animate-ping opacity-40'
                          )}
                          style={{ animationDelay: '0.5s' }}
                        />
                      </>
                    )}
                  </div>

                  {/* Particules attirées */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-2 -left-2 h-1 w-2 animate-pulse rounded-full',
                          `bg-gradient-to-r ${tab.magnetic}`
                        )}
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className={cn(
                          'absolute -right-2 -bottom-2 h-0.5 w-1.5 animate-pulse rounded-full',
                          `bg-gradient-to-r ${tab.magnetic}`
                        )}
                        style={{ animationDelay: '0.3s' }}
                      />
                      <div
                        className={cn(
                          'absolute top-0 -right-2 h-2 w-1 animate-pulse rounded-full',
                          `bg-gradient-to-r ${tab.magnetic}`
                        )}
                        style={{ animationDelay: '0.6s' }}
                      />
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    'relative text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.magnetic} animate-pulse bg-clip-text text-transparent`
                      : 'text-gray-400 group-hover:text-gray-300'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 transform rounded-full',
                        `bg-gradient-to-r ${tab.magnetic}`
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
