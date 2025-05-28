'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation73: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [rippleActive, setRippleActive] = useState(false);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      color: 'from-orange-500 to-red-500'
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
      setRippleActive(true);
      setActiveTab(newTab);
      setTimeout(() => setRippleActive(false), 800);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 p-1">
        <div className="relative overflow-hidden bg-white/80 px-4 py-4 backdrop-blur-lg">
          {/* Vagues de fond */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute right-0 bottom-0 left-0 h-8 animate-pulse bg-gradient-to-t from-cyan-200 to-transparent" />
            <div
              className="absolute right-0 bottom-0 left-0 h-6 animate-pulse bg-gradient-to-t from-blue-200 to-transparent"
              style={{ animationDelay: '0.5s' }}
            />
          </div>

          <div className="relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => handleTabChange(index)}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-center px-3 py-2"
              >
                <div
                  className={cn(
                    'relative mb-2 transform transition-all duration-500 ease-out',
                    'group-hover:scale-105 group-active:scale-95',
                    activeTab === index ? 'scale-110' : ''
                  )}
                >
                  {/* Onde de propagation */}
                  {rippleActive && index === activeTab && (
                    <>
                      <div
                        className={cn(
                          'absolute inset-0 top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full',
                          `bg-gradient-to-r ${tab.color}`,
                          'animate-ping opacity-30'
                        )}
                        style={{ animationDuration: '0.8s' }}
                      />
                      <div
                        className={cn(
                          'absolute inset-0 top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full',
                          `bg-gradient-to-r ${tab.color}`,
                          'animate-ping opacity-20'
                        )}
                        style={{
                          animationDuration: '1s',
                          animationDelay: '0.2s'
                        }}
                      />
                    </>
                  )}

                  {/* Icône avec effet de vague */}
                  <div
                    className={cn(
                      'relative flex h-12 w-12 transform items-center justify-center overflow-hidden rounded-full transition-all duration-500',
                      'group-hover:rotate-12',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'bg-white text-gray-600 shadow-md group-hover:bg-gray-50'
                    )}
                  >
                    {tab.icon}

                    {/* Vague interne */}
                    {activeTab === index && (
                      <div
                        className={cn(
                          'absolute right-0 bottom-0 left-0 h-3 transition-all duration-1000',
                          `bg-gradient-to-t from-white/30 to-transparent`,
                          rippleActive ? 'h-full' : 'h-3'
                        )}
                      />
                    )}
                  </div>

                  {/* Gouttelettes */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-1 -right-1 h-2 w-2 animate-bounce rounded-full',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className={cn(
                          'absolute -bottom-1 -left-1 h-1.5 w-1.5 animate-bounce rounded-full',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{ animationDelay: '0.3s' }}
                      />
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    'relative text-xs font-bold transition-all duration-300',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                      : 'text-gray-600 group-hover:text-gray-800'
                  )}
                >
                  {tab.name}

                  {/* Vague sous le texte */}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute right-0 -bottom-1 left-0 h-0.5 rounded-full transition-all duration-500',
                        `bg-gradient-to-r ${tab.color}`,
                        rippleActive ? 'animate-pulse' : ''
                      )}
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
