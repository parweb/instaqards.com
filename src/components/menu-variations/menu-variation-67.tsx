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
      icon: <Home className="w-5 h-5" />,
      href: '/',
      magnetic: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      magnetic: 'from-purple-500 to-violet-600'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      magnetic: 'from-red-500 to-pink-600'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
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
            'absolute w-1 h-3 transition-all duration-300 ease-out',
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-800 via-slate-800 to-gray-800 p-1">
        <div className="bg-gray-900/90 backdrop-blur-xl px-4 py-4 relative overflow-hidden">
          {/* Lignes de champ magnétique */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
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
                className="absolute w-0.5 h-2 bg-gray-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${magneticPulse * 3 + i * 18}deg) translateY(${Math.sin(magneticPulse * 0.1 + i) * 2}px)`
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
                  {/* Champ magnétique */}
                  <div className="absolute inset-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                    {generateMagneticParticles(index)}
                  </div>

                  {/* Noyau magnétique */}
                  <div
                    className={cn(
                      'relative z-10 w-14 h-14 rounded-full transition-all duration-500 transform',
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
                            'opacity-20 animate-pulse'
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
                          'absolute -top-2 -left-2 w-2 h-1 rounded-full animate-pulse',
                          `bg-gradient-to-r ${tab.magnetic}`
                        )}
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className={cn(
                          'absolute -bottom-2 -right-2 w-1.5 h-0.5 rounded-full animate-pulse',
                          `bg-gradient-to-r ${tab.magnetic}`
                        )}
                        style={{ animationDelay: '0.3s' }}
                      />
                      <div
                        className={cn(
                          'absolute top-0 -right-2 w-1 h-2 rounded-full animate-pulse',
                          `bg-gradient-to-r ${tab.magnetic}`
                        )}
                        style={{ animationDelay: '0.6s' }}
                      />
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-500 relative',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.magnetic} bg-clip-text text-transparent animate-pulse`
                      : 'text-gray-400 group-hover:text-gray-300'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 rounded-full',
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
