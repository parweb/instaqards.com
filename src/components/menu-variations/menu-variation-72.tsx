'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation72: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [previousTab, setPreviousTab] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'from-violet-500 to-purple-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'from-rose-500 to-pink-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleTabChange = (newTab: number) => {
    if (newTab !== activeTab) {
      setPreviousTab(activeTab);
      setIsTransitioning(true);
      setActiveTab(newTab);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-slate-100 via-white to-slate-100 p-1">
        <div className="relative overflow-hidden bg-white/90 px-4 py-4 backdrop-blur-lg">
          {/* Indicateur élastique */}
          <div className="absolute right-0 bottom-2 left-0 flex justify-around">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-1 w-12 rounded-full transition-all duration-600 ease-out',
                  activeTab === index
                    ? `bg-gradient-to-r ${tabs[activeTab].color} scale-x-150`
                    : 'scale-x-100 bg-gray-200',
                  isTransitioning && index === activeTab ? 'animate-pulse' : ''
                )}
                style={{
                  transformOrigin: 'center',
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => handleTabChange(index)}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-center px-3 py-2"
              >
                {/* Conteneur avec effet de ressort */}
                <div
                  className={cn(
                    'relative mb-2 transform transition-all ease-out',
                    'group-hover:scale-105 group-active:scale-95',
                    activeTab === index ? 'scale-110' : '',
                    isTransitioning && index === activeTab
                      ? 'duration-600'
                      : 'duration-300'
                  )}
                  style={{
                    transitionTimingFunction:
                      isTransitioning && index === activeTab
                        ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                        : 'ease-out'
                  }}
                >
                  {/* Icône avec effet élastique */}
                  <div
                    className={cn(
                      'flex h-12 w-12 transform items-center justify-center rounded-full transition-all',
                      'group-hover:rotate-6',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-xl`
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200',
                      isTransitioning && index === activeTab
                        ? 'duration-600'
                        : 'duration-300'
                    )}
                    style={{
                      transitionTimingFunction:
                        isTransitioning && index === activeTab
                          ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                          : 'ease-out'
                    }}
                  >
                    {tab.icon}

                    {/* Onde de choc élastique */}
                    {isTransitioning && index === activeTab && (
                      <>
                        <div
                          className={cn(
                            'absolute inset-0 animate-ping rounded-full opacity-40',
                            `bg-gradient-to-r ${tab.color}`
                          )}
                          style={{ animationDuration: '0.6s' }}
                        />
                        <div
                          className={cn(
                            'absolute -inset-2 animate-ping rounded-full opacity-20',
                            `bg-gradient-to-r ${tab.color}`
                          )}
                          style={{
                            animationDuration: '0.8s',
                            animationDelay: '0.1s'
                          }}
                        />
                      </>
                    )}
                  </div>

                  {/* Particules élastiques */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-1 -right-1 h-2 w-2 rounded-full transition-all duration-300',
                          `bg-gradient-to-r ${tab.color}`,
                          isTransitioning ? 'animate-bounce' : 'animate-pulse'
                        )}
                      />
                      <div
                        className={cn(
                          'absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full transition-all duration-300',
                          `bg-gradient-to-r ${tab.color}`,
                          isTransitioning ? 'animate-bounce' : 'animate-pulse'
                        )}
                        style={{ animationDelay: '0.1s' }}
                      />
                    </>
                  )}
                </div>

                {/* Label avec micro-animation */}
                <span
                  className={cn(
                    'relative text-xs font-bold transition-all',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                      : 'text-gray-600 group-hover:text-gray-800',
                    isTransitioning && index === activeTab
                      ? 'duration-600'
                      : 'duration-300'
                  )}
                  style={{
                    transitionTimingFunction:
                      isTransitioning && index === activeTab
                        ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                        : 'ease-out'
                  }}
                >
                  {tab.name}

                  {/* Soulignement élastique */}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 transform rounded-full transition-all',
                        `bg-gradient-to-r ${tab.color}`,
                        isTransitioning
                          ? 'w-8 duration-600'
                          : 'w-6 duration-300'
                      )}
                      style={{
                        transitionTimingFunction: isTransitioning
                          ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                          : 'ease-out'
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
