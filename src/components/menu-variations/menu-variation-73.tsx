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
      icon: <Home className="w-5 h-5" />,
      href: '/',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 p-1">
        <div className="bg-white/80 backdrop-blur-lg px-4 py-4 relative overflow-hidden">
          {/* Vagues de fond */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-cyan-200 to-transparent animate-pulse" />
            <div
              className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-blue-200 to-transparent animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
          </div>

          <div className="flex items-center justify-around relative z-10">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => handleTabChange(index)}
                className="flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 relative group"
              >
                <div
                  className={cn(
                    'relative mb-2 transition-all duration-500 ease-out transform',
                    'group-hover:scale-105 group-active:scale-95',
                    activeTab === index ? 'scale-110' : ''
                  )}
                >
                  {/* Onde de propagation */}
                  {rippleActive && index === activeTab && (
                    <>
                      <div
                        className={cn(
                          'absolute inset-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full',
                          `bg-gradient-to-r ${tab.color}`,
                          'opacity-30 animate-ping'
                        )}
                        style={{ animationDuration: '0.8s' }}
                      />
                      <div
                        className={cn(
                          'absolute inset-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full',
                          `bg-gradient-to-r ${tab.color}`,
                          'opacity-20 animate-ping'
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
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform relative overflow-hidden',
                      'group-hover:rotate-12',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'bg-white text-gray-600 group-hover:bg-gray-50 shadow-md'
                    )}
                  >
                    {tab.icon}

                    {/* Vague interne */}
                    {activeTab === index && (
                      <div
                        className={cn(
                          'absolute bottom-0 left-0 right-0 h-3 transition-all duration-1000',
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
                          'absolute -top-1 -right-1 w-2 h-2 rounded-full animate-bounce',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className={cn(
                          'absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full animate-bounce',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{ animationDelay: '0.3s' }}
                      />
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-300 relative',
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
                        'absolute -bottom-1 left-0 right-0 h-0.5 rounded-full transition-all duration-500',
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
