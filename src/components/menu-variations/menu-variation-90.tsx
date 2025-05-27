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
      icon: <Home className="w-5 h-5" />,
      href: '#',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '#',
      color: 'from-purple-400 to-pink-400'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '#',
      color: 'from-red-400 to-orange-400'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-1">
        <div className="bg-black/90 backdrop-blur-lg px-4 py-4 relative">
          {/* Indicateur de ruban principal */}
          {indicator && (
            <div
              className="absolute bottom-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent transition-all duration-500 ease-out rounded-full"
              style={{
                left: indicator.left,
                width: indicator.width,
                transform: ribbonSweep ? 'scaleX(1.2)' : 'scaleX(1)'
              }}
            />
          )}

          {/* Menu More étendu */}
          {showMoreMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-black/95 backdrop-blur-lg rounded-2xl p-4 border border-gray-700 shadow-2xl">
              {/* Ruban de balayage pour le menu More */}
              {ribbonSweep && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
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
                    className="flex flex-col items-center p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 group"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setRibbonSweep(true);
                      setTimeout(() => setRibbonSweep(false), 1500);
                    }}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-300',
                        `bg-gradient-to-r ${item.color} group-hover:scale-110`
                      )}
                    >
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors duration-300">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Flèche pointant vers le bouton More */}
              <div className="absolute bottom-0 right-8 transform translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-700"></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-around relative z-10 tab-container">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                ref={el => {
                  tabRefs.current[index] = el;
                }}
                className="flex-1 flex flex-col items-center"
              >
                <button
                  onClick={() => handleTabChange(index)}
                  className="flex flex-col items-center justify-center px-3 py-2 min-w-0 w-full relative group"
                >
                  <div
                    className={cn(
                      'relative mb-2 transition-all duration-500 ease-out transform',
                      'group-hover:scale-110 group-active:scale-95',
                      activeTab === index || (index === 3 && showMoreMenu)
                        ? 'scale-110'
                        : ''
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 transform relative overflow-hidden',
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
                          <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
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
                      'text-xs font-bold transition-all duration-300 relative',
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
