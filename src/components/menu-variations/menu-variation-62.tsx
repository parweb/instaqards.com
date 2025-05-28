'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation62: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [foldAnimation, setFoldAnimation] = useState(false);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-4 w-4" />,
      href: '/',
      shape: 'triangle'
    },
    {
      name: 'Search',
      icon: <Search className="h-4 w-4" />,
      href: '/explore',
      shape: 'diamond'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-4 w-4" />,
      href: '/qards',
      shape: 'hexagon'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-4 w-4" />,
      href: '#',
      shape: 'octagon'
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
      setFoldAnimation(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getShapeClipPath = (shape: string, folded: boolean) => {
    if (folded) {
      switch (shape) {
        case 'triangle':
          return 'polygon(50% 0%, 50% 50%, 50% 100%)';
        case 'diamond':
          return 'polygon(50% 0%, 50% 50%, 50% 100%, 50% 50%)';
        case 'hexagon':
          return 'polygon(50% 0%, 50% 25%, 50% 75%, 50% 100%, 50% 75%, 50% 25%)';
        case 'octagon':
          return 'polygon(50% 0%, 50% 15%, 50% 85%, 50% 100%, 50% 85%, 50% 15%)';
        default:
          return 'polygon(50% 0%, 50% 50%, 50% 100%)';
      }
    } else {
      switch (shape) {
        case 'triangle':
          return 'polygon(50% 0%, 0% 100%, 100% 100%)';
        case 'diamond':
          return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
        case 'hexagon':
          return 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)';
        case 'octagon':
          return 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
        default:
          return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      }
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      {/* Fond papier origami */}
      <div className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 p-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-white via-gray-50 to-white px-4 py-4 backdrop-blur-sm">
          {/* Motifs géométriques de fond */}
          <div className="absolute inset-0 opacity-10">
            <div
              className={cn(
                'absolute top-2 left-4 h-8 w-8 bg-orange-300 transition-all duration-2000 ease-in-out',
                foldAnimation ? 'scale-75 rotate-45' : 'scale-100 rotate-0'
              )}
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            />
            <div
              className={cn(
                'absolute top-1 right-8 h-6 w-6 bg-red-300 transition-all duration-2000 ease-in-out',
                foldAnimation ? 'scale-50 rotate-90' : 'scale-100 rotate-0'
              )}
              style={{
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
              }}
            />
            <div
              className={cn(
                'absolute bottom-2 left-12 h-10 w-10 bg-amber-300 transition-all duration-2000 ease-in-out',
                foldAnimation ? 'scale-125 rotate-180' : 'scale-100 rotate-0'
              )}
              style={{
                clipPath:
                  'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
              }}
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
                {/* Conteneur origami */}
                <div
                  className={cn(
                    'perspective-1000 relative mb-2 transform transition-all duration-1000 ease-out',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-115' : ''
                  )}
                >
                  {/* Ombre portée géométrique */}
                  <div
                    className={cn(
                      'absolute inset-0 translate-x-1 translate-y-1 transform bg-gray-400/20 transition-all duration-1000',
                      activeTab === index
                        ? 'translate-x-2 translate-y-2 opacity-60'
                        : 'opacity-30'
                    )}
                    style={{
                      clipPath: getShapeClipPath(
                        tab.shape,
                        foldAnimation && activeTab === index
                      ),
                      transition:
                        'clip-path 1s ease-in-out, transform 1s ease-out'
                    }}
                  />

                  {/* Forme origami principale */}
                  <div
                    className={cn(
                      'relative z-10 h-14 w-14 transform transition-all duration-1000 ease-in-out',
                      'group-hover:rotate-12',
                      activeTab === index
                        ? 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 shadow-2xl'
                        : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 group-hover:from-orange-200 group-hover:to-red-200'
                    )}
                    style={{
                      clipPath: getShapeClipPath(
                        tab.shape,
                        foldAnimation && activeTab === index
                      ),
                      transition: 'clip-path 1s ease-in-out, all 1s ease-out'
                    }}
                  >
                    {/* Plis origami */}
                    <div
                      className={cn(
                        'absolute inset-0 transition-all duration-1000',
                        activeTab === index ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      <div className="absolute top-1/4 right-1/4 left-1/4 h-px -rotate-45 transform bg-white/30" />
                      <div className="absolute top-1/2 right-1/4 left-1/4 h-px rotate-45 transform bg-white/20" />
                      <div className="absolute top-3/4 right-1/4 left-1/4 h-px -rotate-45 transform bg-white/30" />
                    </div>

                    {/* Icône */}
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      {tab.icon}
                    </div>
                  </div>

                  {/* Particules géométriques */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-1 -left-1 h-2 w-2 animate-bounce bg-orange-400 transition-all duration-1000',
                          foldAnimation ? 'rotate-45' : 'rotate-0'
                        )}
                        style={{
                          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                          animationDelay: '0s'
                        }}
                      />
                      <div
                        className={cn(
                          'absolute -right-1 -bottom-1 h-1.5 w-1.5 animate-bounce bg-red-400 transition-all duration-1000',
                          foldAnimation ? 'rotate-90' : 'rotate-0'
                        )}
                        style={{
                          clipPath:
                            'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                          animationDelay: '0.5s'
                        }}
                      />
                      <div
                        className={cn(
                          'absolute top-0 -right-1 h-1 w-1 animate-bounce bg-pink-400 transition-all duration-1000',
                          foldAnimation ? 'rotate-180' : 'rotate-0'
                        )}
                        style={{
                          clipPath:
                            'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                          animationDelay: '1s'
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Label avec effet pliage */}
                <span
                  className={cn(
                    'relative text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? 'animate-pulse text-orange-600'
                      : 'text-gray-600 group-hover:text-gray-800'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 transform bg-gradient-to-r from-orange-400 to-red-400 transition-all duration-1000',
                        foldAnimation
                          ? 'scale-x-50 rotate-45'
                          : 'scale-x-100 rotate-0'
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
