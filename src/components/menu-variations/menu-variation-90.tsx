'use client';

import { Heart, Home, MoreHorizontal, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from 'lib/utils';

export const MenuVariation90: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [ribbonSweep, setRibbonSweep] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '#',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '#',
      color: 'from-purple-400 to-pink-400'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '#',
      color: 'from-red-400 to-orange-400'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      color: 'from-green-400 to-teal-400'
    }
  ];

  const moreMenuItems = [
    { name: 'Profile', icon: '👤', color: 'from-indigo-400 to-purple-400' },
    { name: 'Settings', icon: '⚙️', color: 'from-gray-400 to-slate-400' },
    {
      name: 'Notifications',
      icon: '🔔',
      color: 'from-yellow-400 to-orange-400'
    },
    { name: 'Help', icon: '❓', color: 'from-pink-400 to-rose-400' },
    { name: 'About', icon: 'ℹ️', color: 'from-cyan-400 to-blue-400' },
    { name: 'Logout', icon: '🚪', color: 'from-red-400 to-pink-400' }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Initialiser l'indicateur dès que le composant est mobile
  useEffect(() => {
    if (isMobile) {
      const initIndicator = () => {
        const container = document.querySelector('.tab-container');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const containerWidth = containerRect.width;
          const tabWidth = containerWidth / 4;
          const indicatorWidth = 48;

          const centerX = activeTab * tabWidth + tabWidth / 2;

          setIndicator({
            left: centerX - indicatorWidth / 2,
            width: indicatorWidth
          });
        }
      };

      // Délai pour s'assurer que le DOM est complètement rendu
      const timer = setTimeout(initIndicator, 200);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  useEffect(() => {
    const updateIndicator = () => {
      const container = document.querySelector('.tab-container');
      if (container && isMobile) {
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const tabWidth = containerWidth / 4; // 4 onglets
        const indicatorWidth = 48; // Largeur de l'icône (w-12 = 48px)

        // Position centrale de chaque onglet
        const centerX = activeTab * tabWidth + tabWidth / 2;

        setIndicator({
          left: centerX - indicatorWidth / 2,
          width: indicatorWidth
        });
      }
    };

    // Délai pour s'assurer que le DOM est rendu
    const timer = setTimeout(updateIndicator, 100);

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab, isMobile]);

  const handleTabChange = (index: number) => {
    if (index === 3) {
      // Index du bouton "More"
      setShowMoreMenu(!showMoreMenu);
      setActiveTab(3); // Marquer More comme actif
      setRibbonSweep(true);
      setTimeout(() => setRibbonSweep(false), 1500);
    } else if (index !== activeTab) {
      setRibbonSweep(true);
      setActiveTab(index);
      setShowMoreMenu(false); // Fermer le menu More si ouvert
      setTimeout(() => setRibbonSweep(false), 1500);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-1">
        <div className="relative bg-black/90 px-4 py-4 backdrop-blur-lg">
          {/* Indicateur de ruban principal */}
          {indicator && (
            <div
              className="absolute bottom-0 h-1 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-all duration-500 ease-out"
              style={{
                left: indicator.left,
                width: indicator.width,
                transform: ribbonSweep ? 'scaleX(1.2)' : 'scaleX(1)'
              }}
            />
          )}

          {/* Menu More étendu */}
          {showMoreMenu && (
            <div className="absolute right-0 bottom-full left-0 mb-2 rounded-2xl border border-gray-700 bg-black/95 p-4 shadow-2xl backdrop-blur-lg">
              {/* Ruban de balayage pour le menu More */}
              {ribbonSweep && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background: `linear-gradient(90deg, 
                      transparent 0%, 
                      rgba(255,255,255,0.1) 45%, 
                      rgba(255,255,255,0.3) 50%, 
                      rgba(255,255,255,0.1) 55%, 
                      transparent 100%)`,
                    animation: 'ribbonSweep 1.5s ease-in-out',
                    transform: 'translateX(-100%)'
                  }}
                />
              )}

              <div className="grid grid-cols-3 gap-3">
                {moreMenuItems.map(item => (
                  <button
                    key={item.name}
                    className="group flex flex-col items-center rounded-xl bg-gray-800/50 p-3 transition-all duration-300 hover:bg-gray-700/50"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setRibbonSweep(true);
                      setTimeout(() => setRibbonSweep(false), 1500);
                    }}
                  >
                    <div
                      className={cn(
                        'mb-2 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
                        `bg-gradient-to-r ${item.color} group-hover:scale-110`
                      )}
                    >
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className="text-xs text-gray-300 transition-colors duration-300 group-hover:text-white">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Flèche pointant vers le bouton More */}
              <div className="absolute right-8 bottom-0 translate-y-full transform">
                <div className="h-0 w-0 border-t-8 border-r-4 border-l-4 border-t-gray-700 border-r-transparent border-l-transparent"></div>
              </div>
            </div>
          )}

          <div className="tab-container relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                ref={el => {
                  tabRefs.current[index] = el;
                }}
                className="flex flex-1 flex-col items-center"
              >
                <button
                  onClick={() => handleTabChange(index)}
                  className="group relative flex w-full min-w-0 flex-col items-center justify-center px-3 py-2"
                >
                  <div
                    className={cn(
                      'relative mb-2 transform transition-all duration-500 ease-out',
                      'group-hover:scale-110 group-active:scale-95',
                      activeTab === index || (index === 3 && showMoreMenu)
                        ? 'scale-110'
                        : ''
                    )}
                  >
                    <div
                      className={cn(
                        'relative flex h-12 w-12 transform items-center justify-center overflow-hidden rounded-2xl transition-all duration-500',
                        'group-hover:rotate-3',
                        activeTab === index || (index === 3 && showMoreMenu)
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                          : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'
                      )}
                    >
                      {tab.icon}

                      {/* Effet ruban sur l'icône active */}
                      {(activeTab === index ||
                        (index === 3 && showMoreMenu)) && (
                        <>
                          <div className="pointer-events-none absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                          {/* Ruban diagonal */}
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10"
                            style={{
                              clipPath:
                                'polygon(0% 0%, 30% 0%, 70% 100%, 0% 100%)',
                              animation: ribbonSweep
                                ? 'ribbonShine 1.5s ease-in-out'
                                : 'none'
                            }}
                          />
                          {/* Ruban horizontal */}
                          {ribbonSweep && (
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                              style={{
                                animation: 'ribbonHorizontal 1.5s ease-in-out'
                              }}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'relative text-xs font-bold transition-all duration-300',
                      activeTab === index || (index === 3 && showMoreMenu)
                        ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                        : 'text-gray-400 group-hover:text-gray-300'
                    )}
                  >
                    {tab.name}
                    {/* Effet de brillance sur le texte */}
                    {ribbonSweep &&
                      (activeTab === index ||
                        (index === 3 && showMoreMenu)) && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                          style={{
                            animation: 'textShine 1.5s ease-in-out',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text'
                          }}
                        />
                      )}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations de ruban */}
      <style jsx>{`
        @keyframes ribbonSweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes ribbonShine {
          0% {
            opacity: 0;
            transform: translateX(-100%) skewX(-20deg);
          }
          50% {
            opacity: 1;
            transform: translateX(0%) skewX(-20deg);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) skewX(-20deg);
          }
        }

        @keyframes ribbonHorizontal {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes textShine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </nav>
  );
};
