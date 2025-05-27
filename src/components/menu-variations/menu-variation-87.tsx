'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation87: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      color: 'from-purple-400 to-pink-400'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      color: 'from-red-400 to-orange-400'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
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

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Fond avec effet de verre */}
      <div className="relative">
        {/* Couche de fond colorée */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-gray-900/30 to-transparent backdrop-blur-3xl" />

        {/* Effet de verre principal */}
        <div className="relative bg-white/10 backdrop-blur-2xl border-t border-white/20 px-4 py-4">
          {/* Reflets de verre */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Indicateur en verre */}
          {indicator && (
            <div
              className="absolute bottom-6 h-1 rounded-full transition-all duration-800 ease-out"
              style={{
                left: indicator.left,
                width: indicator.width,
                background: `linear-gradient(90deg, ${tabs[activeTab].color.replace('from-', '').replace(' to-', ', ')})`,
                boxShadow: `0 0 20px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
              }}
            >
              {/* Reflet sur l'indicateur */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/40 via-transparent to-white/20" />
            </div>
          )}

          <div className="flex items-center justify-around relative z-10">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                ref={el => {
                  tabRefs.current[index] = el;
                }}
                className="flex-1 flex flex-col items-center"
              >
                <Link
                  href={tab.href}
                  onClick={() => setActiveTab(index)}
                  className="flex flex-col items-center justify-center px-3 py-2 min-w-0 w-full relative group"
                >
                  <div
                    className={cn(
                      'relative mb-2 transition-all duration-500 ease-out transform',
                      'group-hover:scale-110 group-active:scale-95',
                      activeTab === index ? 'scale-110' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 transform relative overflow-hidden',
                        'group-hover:rotate-3',
                        activeTab === index
                          ? 'text-white'
                          : 'text-gray-300 group-hover:text-white'
                      )}
                      style={{
                        background:
                          activeTab === index
                            ? `linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))`
                            : 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(20px)',
                        border:
                          activeTab === index
                            ? '1px solid rgba(255,255,255,0.3)'
                            : '1px solid rgba(255,255,255,0.1)',
                        boxShadow:
                          activeTab === index
                            ? `0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)`
                            : 'inset 0 1px 0 rgba(255,255,255,0.1)'
                      }}
                    >
                      {/* Gradient de couleur pour l'onglet actif */}
                      {activeTab === index && (
                        <div
                          className="absolute inset-0 rounded-2xl opacity-20"
                          style={{
                            background: `linear-gradient(135deg, ${tabs[activeTab].color.replace('from-', '').replace(' to-', ', ')})`
                          }}
                        />
                      )}

                      {/* Reflets internes */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                      <div className="relative z-10">{tab.icon}</div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-bold transition-all duration-300 relative',
                      activeTab === index
                        ? 'text-white drop-shadow-lg'
                        : 'text-gray-300 group-hover:text-white'
                    )}
                    style={{
                      textShadow:
                        activeTab === index
                          ? '0 0 10px rgba(255,255,255,0.5)'
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
