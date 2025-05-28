'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Home,
  Search,
  Heart,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation93: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const minSwipeDistance = 50;

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

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setSwipeDirection('left');
      if (activeTab < tabs.length - 1) {
        setActiveTab(activeTab + 1);
      }
    } else if (isRightSwipe) {
      setSwipeDirection('right');
      if (activeTab > 0) {
        setActiveTab(activeTab - 1);
      }
    }

    setTimeout(() => setSwipeDirection(null), 300);
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-1">
        <div
          ref={containerRef}
          className="relative overflow-hidden bg-black/90 px-4 py-4 backdrop-blur-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Indicateurs de geste */}
          <div className="absolute top-2 left-4 flex items-center space-x-2">
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-all duration-300',
                swipeDirection === 'right'
                  ? 'scale-125 text-green-400'
                  : 'text-gray-500',
                activeTab === 0 ? 'opacity-30' : 'opacity-100'
              )}
            />
            <span className="text-xs text-gray-400">Swipe</span>
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-all duration-300',
                swipeDirection === 'left'
                  ? 'scale-125 text-green-400'
                  : 'text-gray-500',
                activeTab === tabs.length - 1 ? 'opacity-30' : 'opacity-100'
              )}
            />
          </div>

          {/* Effet de swipe */}
          {swipeDirection && (
            <div
              className={cn(
                'pointer-events-none absolute inset-0 transition-all duration-300',
                swipeDirection === 'left'
                  ? 'bg-gradient-to-l from-green-500/20 to-transparent'
                  : 'bg-gradient-to-r from-green-500/20 to-transparent'
              )}
            />
          )}

          {/* Indicateur principal */}
          {indicator && (
            <div
              className={cn(
                'absolute bottom-6 h-1 rounded-full transition-all duration-500',
                `bg-gradient-to-r ${tabs[activeTab].color}`
              )}
              style={{
                left: indicator.left,
                width: indicator.width
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
                      activeTab === index ? 'scale-110' : '',
                      swipeDirection && activeTab === index
                        ? 'animate-pulse'
                        : ''
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
                    >
                      {tab.icon}

                      {/* Indicateur de navigation gestuelle */}
                      {activeTab === index && swipeDirection && (
                        <div
                          className={cn(
                            'absolute inset-0 animate-ping rounded-2xl border-2 border-green-400'
                          )}
                        />
                      )}

                      {/* Points de navigation */}
                      {activeTab === index && (
                        <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 transform space-x-1">
                          {tabs.map((_, dotIndex) => (
                            <div
                              key={dotIndex}
                              className={cn(
                                'h-1 w-1 rounded-full transition-all duration-300',
                                dotIndex === activeTab
                                  ? 'bg-white'
                                  : 'bg-white/30'
                              )}
                            />
                          ))}
                        </div>
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
                  >
                    {tab.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>

          {/* Instructions de geste */}
          <div className="absolute right-4 bottom-1 text-xs text-gray-500">
            👆 Swipe to navigate
          </div>
        </div>
      </div>
    </nav>
  );
};
