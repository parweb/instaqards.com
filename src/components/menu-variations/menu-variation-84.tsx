'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation84: React.FC = () => {
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
      <div className="relative bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 p-1">
        <div className="bg-gray-900/95 backdrop-blur-xl px-4 py-4 relative overflow-hidden">
          {/* Ombres dynamiques multiples */}
          {indicator && (
            <>
              {/* Ombre principale */}
              <div
                className={cn(
                  'absolute bottom-0 h-16 rounded-t-3xl transition-all duration-800 ease-out',
                  `bg-gradient-to-t ${tabs[activeTab].color}`,
                  'opacity-20 blur-xl'
                )}
                style={{
                  left: indicator.left - 8,
                  width: indicator.width + 16,
                  transform: 'translateY(8px)'
                }}
              />
              {/* Ombre secondaire */}
              <div
                className={cn(
                  'absolute bottom-2 h-12 rounded-t-2xl transition-all duration-700 ease-out',
                  `bg-gradient-to-t ${tabs[activeTab].color}`,
                  'opacity-30 blur-lg'
                )}
                style={{
                  left: indicator.left - 4,
                  width: indicator.width + 8,
                  transform: 'translateY(4px)'
                }}
              />
              {/* Ombre de focus */}
              <div
                className={cn(
                  'absolute bottom-4 h-8 rounded-t-xl transition-all duration-600 ease-out',
                  `bg-gradient-to-t ${tabs[activeTab].color}`,
                  'opacity-40 blur-md'
                )}
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  transform: 'translateY(2px)'
                }}
              />
            </>
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
                      activeTab === index ? 'scale-110 -translate-y-1' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 transform relative',
                        'group-hover:rotate-2',
                        activeTab === index
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl`
                          : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'
                      )}
                      style={{
                        boxShadow:
                          activeTab === index
                            ? `0 8px 32px -8px rgba(59, 130, 246, 0.5)`
                            : 'none'
                      }}
                    >
                      {tab.icon}
                      {/* Reflet interne */}
                      {activeTab === index && (
                        <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-bold transition-all duration-300 relative',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent drop-shadow-sm`
                        : 'text-gray-400 group-hover:text-gray-300'
                    )}
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
