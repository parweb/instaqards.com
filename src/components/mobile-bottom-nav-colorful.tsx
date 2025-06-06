'use client';

import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  LuChartColumn,
  LuGlobe,
  LuLayoutDashboard,
  LuLink,
  LuSeparatorHorizontal,
  LuUsers
} from 'react-icons/lu';

import { useModal } from 'components/modal/provider';
import { useCurrentRole } from 'hooks/use-current-role';
import { useIsMobile } from 'hooks/use-mobile';
import useTranslation from 'hooks/use-translation';
import { cn } from 'lib/utils';

export const MobileBottomNavColorful = () => {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };
  const translate = useTranslation();
  const role = useCurrentRole();
  const modal = useModal();
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState(0);
  const [ribbonSweep, setRibbonSweep] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);

  const [, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  const appTabs = useMemo(() => {
    // Si on est dans une page de site spécifique
    if (segments[0] === 'site' && id) {
      return [
        {
          name: translate('menu.design'),
          href: `/site/${id}`,
          icon: <LuLayoutDashboard className="h-5 w-5" />,
          isActive: segments.length === 2,
          color: 'from-blue-400 to-cyan-400'
        },
        {
          name: translate('menu.subscribers'),
          href: `/site/${id}/subscribers`,
          icon: <LuUsers className="h-5 w-5" />,
          isActive: segments.includes('subscribers'),
          color: 'from-purple-400 to-pink-400'
        },
        {
          name: translate('menu.analytics'),
          href: `/site/${id}/analytics`,
          icon: <LuChartColumn className="h-5 w-5" />,
          isActive: segments.includes('analytics'),
          color: 'from-red-400 to-orange-400'
        },
        {
          name: 'Plus',
          href: '#',
          icon: <LuSeparatorHorizontal className="h-5 w-5" />,
          isActive: false,
          color: 'from-green-400 to-teal-400'
        }
      ];
    }

    // Navigation principale de l'app
    return [
      {
        name: translate('menu.overview'),
        href: '/',
        icon: <LuLayoutDashboard className="h-5 w-5" />,
        isActive: segments.length === 0,
        color: 'from-blue-400 to-cyan-400'
      },
      {
        name: translate('menu.sites'),
        href: '/sites',
        icon: <LuGlobe className="h-5 w-5" />,
        isActive: segments[0] === 'sites',
        color: 'from-purple-400 to-pink-400'
      },
      {
        name: translate('menu.links'),
        href: '/links',
        icon: <LuLink className="h-5 w-5" />,
        isActive: segments[0] === 'links',
        color: 'from-red-400 to-orange-400'
      },
      {
        name: 'Plus',
        href: '#',
        icon: <LuSeparatorHorizontal className="h-5 w-5" />,
        isActive: false,
        color: 'from-green-400 to-teal-400'
      }
    ];
  }, [translate, segments, id, role]);

  // Menu complet pour l'overlay
  const moreMenuItems = useMemo(() => {
    if (segments[0] === 'site' && id) {
      return [
        {
          name: translate('menu.reservations'),
          icon: '📅',
          color: 'from-indigo-400 to-purple-400',
          href: `/site/${id}/reservations`
        },
        {
          name: translate('menu.settings'),
          icon: '⚙️',
          color: 'from-gray-400 to-slate-400',
          href: `/site/${id}/settings`
        },
        {
          name: translate('menu.help'),
          icon: '❓',
          color: 'from-pink-400 to-rose-400',
          href: '/help'
        }
      ];
    }

    return [
      {
        name: translate('menu.generator'),
        icon: '🔧',
        color: 'from-indigo-400 to-purple-400',
        href: '/generator'
      },
      {
        name: translate('menu.affiliation'),
        icon: '💰',
        color: 'from-yellow-400 to-orange-400',
        href: '/affiliation'
      },
      {
        name: translate('menu.settings'),
        icon: '⚙️',
        color: 'from-gray-400 to-slate-400',
        href: '/settings'
      },
      {
        name: translate('menu.help'),
        icon: '❓',
        color: 'from-pink-400 to-rose-400',
        href: '/help'
      }
    ];
  }, [translate, segments, id, role]);

  const tabs = appTabs;

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

  // Déterminer l'onglet actif basé sur la route
  useEffect(() => {
    if (segments[0] === 'site' && id) {
      if (segments.length === 2)
        setActiveTab(0); // design
      else if (segments.includes('subscribers')) setActiveTab(1);
      else if (segments.includes('analytics')) setActiveTab(2);
    } else {
      if (segments.length === 0)
        setActiveTab(0); // overview
      else if (segments[0] === 'sites') setActiveTab(1);
      else if (segments[0] === 'links') setActiveTab(2);
    }
  }, [segments, id]);

  const handleTabChange = (index: number) => {
    if (index === 3) {
      // Index du bouton "More"
      if (showMoreMenu) {
        // Fermer le menu avec animation
        setIsMenuAnimating(true);
        setTimeout(() => {
          setShowMoreMenu(false);
          setIsMenuAnimating(false);
        }, 300);
      } else {
        // Ouvrir le menu avec animation
        setShowMoreMenu(true);
        setIsMenuAnimating(true);
        setTimeout(() => setIsMenuAnimating(false), 300);
      }
      setActiveTab(3); // Marquer More comme actif
      setRibbonSweep(true);
      setTimeout(() => setRibbonSweep(false), 1500);
    } else if (index !== activeTab) {
      setRibbonSweep(true);
      setActiveTab(index);
      // Fermer le menu More si ouvert avec animation
      if (showMoreMenu) {
        setIsMenuAnimating(true);
        setTimeout(() => {
          setShowMoreMenu(false);
          setIsMenuAnimating(false);
        }, 300);
      }
      setTimeout(() => setRibbonSweep(false), 1500);
    }
  };

  if (!isMobile || modal?.isOpen === true) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative">
        <div className="relative bg-white/0 backdrop-blur-lg">
          {/* Menu More étendu */}
          {showMoreMenu && (
            <div
              className={cn(
                'absolute right-0 bottom-full left-0 mb-2 rounded-2xl border border-gray-700 bg-black/95 p-4 shadow-2xl backdrop-blur-lg transition-all duration-300 ease-out',
                isMenuAnimating && !showMoreMenu
                  ? 'translate-y-2 scale-95 opacity-0'
                  : 'translate-y-0 scale-100 opacity-100'
              )}
              style={{
                animation:
                  showMoreMenu && !isMenuAnimating
                    ? 'menuSlideUp 0.3s ease-out'
                    : undefined
              }}
            >
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
                {moreMenuItems.map((item, itemIndex) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex flex-col items-center rounded-xl bg-gray-800/50 p-3 transition-all duration-300 hover:bg-gray-700/50"
                    style={{
                      animation:
                        showMoreMenu && !isMenuAnimating
                          ? `menuItemSlideUp 0.3s ease-out ${itemIndex * 0.05}s both`
                          : undefined
                    }}
                    onClick={() => {
                      setIsMenuAnimating(true);
                      setTimeout(() => {
                        setShowMoreMenu(false);
                        setIsMenuAnimating(false);
                      }, 300);
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
                  </Link>
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
                {index === 3 ? (
                  // Bouton More
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
                ) : (
                  // Liens normaux
                  <Link
                    href={tab.href}
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
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
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

        @keyframes menuSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes menuItemSlideUp {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};
