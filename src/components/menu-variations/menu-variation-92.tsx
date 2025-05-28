'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal, Sun, Moon } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation92: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Détection du thème système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsTransitioning(true);
      setIsDarkMode(e.matches);
      setTimeout(() => setIsTransitioning(false), 500);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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

  const toggleTheme = () => {
    setIsTransitioning(true);
    setIsDarkMode(!isDarkMode);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (!isMobile) return null;

  const themeClasses = isDarkMode
    ? {
        background: 'from-gray-900 via-black to-gray-900',
        container: 'bg-black/90',
        iconBg: 'bg-gray-800',
        iconBgHover: 'group-hover:bg-gray-700',
        iconText: 'text-gray-400',
        iconTextHover: 'group-hover:text-gray-300'
      }
    : {
        background: 'from-blue-50 via-white to-blue-50',
        container: 'bg-white/90',
        iconBg: 'bg-gray-100',
        iconBgHover: 'group-hover:bg-gray-200',
        iconText: 'text-gray-600',
        iconTextHover: 'group-hover:text-gray-800'
      };

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div
        className={cn(
          'relative bg-gradient-to-r p-1 transition-all duration-500',
          themeClasses.background
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden px-4 py-4 backdrop-blur-lg transition-all duration-500',
            themeClasses.container
          )}
        >
          {/* Bouton de changement de thème */}
          <button
            onClick={toggleTheme}
            className={cn(
              'absolute top-2 right-4 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
              isDarkMode
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                : 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30'
            )}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Indicateur de transition */}
          {isTransitioning && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          )}

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
                boxShadow: isDarkMode
                  ? '0 0 20px rgba(255, 255, 255, 0.3)'
                  : '0 0 20px rgba(0, 0, 0, 0.2)'
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
                          : cn(
                              themeClasses.iconBg,
                              themeClasses.iconBgHover,
                              themeClasses.iconText,
                              themeClasses.iconTextHover
                            )
                      )}
                    >
                      {tab.icon}

                      {/* Effet de thème adaptatif */}
                      {activeTab === index && (
                        <div
                          className={cn(
                            'pointer-events-none absolute inset-1 rounded-xl transition-all duration-500',
                            isDarkMode
                              ? 'bg-gradient-to-br from-white/20 to-transparent'
                              : 'bg-gradient-to-br from-white/40 to-transparent'
                          )}
                        />
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'relative text-xs font-bold transition-all duration-300',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                        : cn(themeClasses.iconText, themeClasses.iconTextHover)
                    )}
                  >
                    {tab.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>

          {/* Indicateur de mode */}
          <div
            className={cn(
              'absolute bottom-1 left-4 text-xs transition-all duration-500',
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            )}
          >
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </div>
        </div>
      </div>
    </nav>
  );
};
