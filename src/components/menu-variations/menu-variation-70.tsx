'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation70: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [morphState, setMorphState] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      morph: 'from-teal-400 to-cyan-500'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      morph: 'from-violet-400 to-purple-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      morph: 'from-rose-400 to-pink-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      morph: 'from-amber-400 to-orange-500'
    }
  ];

  const shapes = [
    'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle
    'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // Diamond
    'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', // Octagon
    'circle(50%)', // Circle
    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Square
    'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)' // Star-like
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMorphState(prev => (prev + 1) % shapes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-100 via-white to-gray-100 p-1">
        <div className="bg-white/95 backdrop-blur-sm px-4 py-4 relative overflow-hidden">
          {/* Formes morphantes de fond */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute bg-gradient-to-br from-gray-300 to-gray-400 transition-all duration-2000 ease-in-out"
                style={{
                  width: `${20 + Math.random() * 20}px`,
                  height: `${20 + Math.random() * 20}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  clipPath: shapes[(morphState + i) % shapes.length],
                  transform: `rotate(${morphState * 60 + i * 30}deg) scale(${0.5 + Math.sin(morphState + i) * 0.3})`
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
                    'relative mb-2 transition-all duration-700 ease-out transform',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-115' : ''
                  )}
                >
                  {/* Forme morphante principale */}
                  <div
                    className={cn(
                      'relative z-10 w-14 h-14 transition-all duration-2000 ease-in-out transform',
                      'group-hover:rotate-12',
                      activeTab === index ? 'shadow-2xl' : 'shadow-lg'
                    )}
                    style={{
                      clipPath: shapes[(morphState + index) % shapes.length],
                      background:
                        activeTab === index
                          ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                          : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
                    }}
                  >
                    {/* Couche de couleur morphante */}
                    <div
                      className={cn(
                        'absolute inset-0 transition-all duration-2000 ease-in-out',
                        `bg-gradient-to-br ${tab.morph}`,
                        activeTab === index
                          ? 'opacity-80'
                          : 'opacity-0 group-hover:opacity-40'
                      )}
                      style={{
                        clipPath: shapes[(morphState + index) % shapes.length]
                      }}
                    />

                    {/* Icône au centre */}
                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center transition-all duration-500',
                        activeTab === index
                          ? 'text-white'
                          : 'text-gray-600 group-hover:text-gray-700'
                      )}
                    >
                      {tab.icon}
                    </div>

                    {/* Effet de brillance morphant */}
                    {activeTab === index && (
                      <div
                        className={cn(
                          'absolute inset-0 transition-all duration-2000 ease-in-out',
                          'bg-gradient-to-tr from-white/30 via-transparent to-transparent'
                        )}
                        style={{
                          clipPath: shapes[(morphState + index) % shapes.length]
                        }}
                      />
                    )}
                  </div>

                  {/* Particules morphantes */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-1 -left-1 w-2 h-2 transition-all duration-2000 ease-in-out animate-bounce',
                          `bg-gradient-to-r ${tab.morph}`
                        )}
                        style={{
                          clipPath: shapes[morphState % shapes.length],
                          animationDelay: '0s'
                        }}
                      />
                      <div
                        className={cn(
                          'absolute -bottom-1 -right-1 w-1.5 h-1.5 transition-all duration-2000 ease-in-out animate-bounce',
                          `bg-gradient-to-r ${tab.morph}`
                        )}
                        style={{
                          clipPath: shapes[(morphState + 1) % shapes.length],
                          animationDelay: '0.5s'
                        }}
                      />
                      <div
                        className={cn(
                          'absolute top-0 -right-1 w-1 h-1 transition-all duration-2000 ease-in-out animate-bounce',
                          `bg-gradient-to-r ${tab.morph}`
                        )}
                        style={{
                          clipPath: shapes[(morphState + 2) % shapes.length],
                          animationDelay: '1s'
                        }}
                      />
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-500 relative',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.morph} bg-clip-text text-transparent animate-pulse`
                      : 'text-gray-600 group-hover:text-gray-700'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 transition-all duration-2000 ease-in-out',
                        `bg-gradient-to-r ${tab.morph}`
                      )}
                      style={{
                        clipPath: shapes[morphState % shapes.length]
                      }}
                    />
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Indicateur de morphing */}
          <div className="absolute bottom-1 right-2 text-[8px] text-gray-500 font-mono">
            MORPH: {morphState + 1}/{shapes.length}
          </div>
        </div>
      </div>
    </nav>
  );
};
