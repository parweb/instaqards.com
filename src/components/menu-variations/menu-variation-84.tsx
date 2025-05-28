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

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 p-1">
        <div className="relative overflow-hidden bg-gray-900/95 px-4 py-4 backdrop-blur-xl">
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
                      activeTab === index ? '-translate-y-1 scale-110' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'relative flex h-12 w-12 transform items-center justify-center rounded-2xl transition-all duration-500',
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
                        <div className="pointer-events-none absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'relative text-xs font-bold transition-all duration-300',
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
