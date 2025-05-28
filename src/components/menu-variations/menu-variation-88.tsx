'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation88: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [fireflies, setFireflies] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      opacity: number;
      size: number;
    }>
  >([]);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'from-purple-400 to-pink-400'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'from-red-400 to-orange-400'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
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

  // Animation des lucioles
  useEffect(() => {
    if (!indicator) return;

    // Initialiser les lucioles
    const newFireflies = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: indicator.left + Math.random() * indicator.width,
      y: 20 + Math.random() * 40,
      opacity: 0.3 + Math.random() * 0.7,
      size: 2 + Math.random() * 3
    }));
    setFireflies(newFireflies);

    const animateFireflies = () => {
      setFireflies(prev =>
        prev.map(firefly => ({
          ...firefly,
          x:
            indicator.left +
            (firefly.x - indicator.left) +
            (Math.random() - 0.5) * 4,
          y: firefly.y + (Math.random() - 0.5) * 3,
          opacity:
            0.2 + Math.abs(Math.sin(Date.now() * 0.003 + firefly.id)) * 0.8
        }))
      );
      animationRef.current = requestAnimationFrame(animateFireflies);
    };

    animationRef.current = requestAnimationFrame(animateFireflies);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [indicator, activeTab]);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-1">
        <div className="relative overflow-hidden bg-black/90 px-4 py-4 backdrop-blur-lg">
          {/* Lucioles */}
          {fireflies.map(firefly => (
            <div
              key={firefly.id}
              className={cn(
                'pointer-events-none absolute rounded-full transition-all duration-300',
                `bg-gradient-to-r ${tabs[activeTab].color}`
              )}
              style={{
                left: firefly.x,
                top: firefly.y,
                width: firefly.size,
                height: firefly.size,
                opacity: firefly.opacity,
                boxShadow: `0 0 ${firefly.size * 3}px rgba(255, 255, 255, ${firefly.opacity})`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Indicateur principal */}
          {indicator && (
            <div
              className={cn(
                'absolute bottom-6 h-1 rounded-full transition-all duration-700',
                `bg-gradient-to-r ${tabs[activeTab].color}`
              )}
              style={{
                left: indicator.left,
                width: indicator.width,
                boxShadow: `0 0 20px rgba(255, 255, 255, 0.3)`
              }}
            />
          )}

          <div className="relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                ref={el => {
                  tabRefs.current[index] = el;
                }}
                className="flex flex-1 flex-col items-center"
              >
                <Link
                  href={tab.href}
                  onClick={() => setActiveTab(index)}
                  className="group relative flex w-full min-w-0 flex-col items-center justify-center px-3 py-2"
                >
                  <div
                    className={cn(
                      'relative mb-2 transform transition-all duration-500 ease-out',
                      'group-hover:scale-110 group-active:scale-95',
                      activeTab === index ? 'scale-110' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'relative flex h-12 w-12 transform items-center justify-center rounded-2xl transition-all duration-500',
                        'group-hover:rotate-3',
                        activeTab === index
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                          : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'
                      )}
                      style={{
                        boxShadow:
                          activeTab === index
                            ? `0 0 30px rgba(255, 255, 255, 0.2)`
                            : 'none'
                      }}
                    >
                      {tab.icon}

                      {/* Lueur interne pour l'onglet actif */}
                      {activeTab === index && (
                        <>
                          <div className="pointer-events-none absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                          {/* Particules scintillantes */}
                          {Array.from({ length: 4 }, (_, i) => (
                            <div
                              key={i}
                              className="absolute h-1 w-1 animate-ping rounded-full bg-white"
                              style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${20 + Math.random() * 60}%`,
                                animationDelay: `${i * 0.3}s`,
                                animationDuration: '2s'
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'relative text-xs font-bold transition-all duration-300',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                        : 'text-gray-400 group-hover:text-gray-300'
                    )}
                    style={{
                      textShadow:
                        activeTab === index
                          ? '0 0 10px rgba(255,255,255,0.3)'
                          : 'none'
                    }}
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
