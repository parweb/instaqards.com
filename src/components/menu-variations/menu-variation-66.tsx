'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation66: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [bubbleFloat, setBubbleFloat] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      bubble: 'from-blue-200 via-purple-200 to-pink-200'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      bubble: 'from-green-200 via-cyan-200 to-blue-200'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      bubble: 'from-pink-200 via-red-200 to-orange-200'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      bubble: 'from-yellow-200 via-green-200 to-teal-200'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbleFloat(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-sky-100 via-blue-50 to-cyan-100 p-1">
        <div className="relative overflow-hidden bg-white/80 px-4 py-4 backdrop-blur-lg">
          {/* Bulles de fond */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className="absolute animate-bounce rounded-full bg-gradient-to-br from-white/40 to-blue-200/20"
                style={{
                  width: `${8 + Math.random() * 12}px`,
                  height: `${8 + Math.random() * 12}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  transform: `translateY(${Math.sin(bubbleFloat * 0.02 + i) * 5}px)`
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-center px-3 py-2"
              >
                <div
                  className={cn(
                    'relative mb-2 transform transition-all duration-700 ease-out',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-120' : ''
                  )}
                  style={{
                    transform: `translateY(${Math.sin(bubbleFloat * 0.03 + index) * 3}px) ${activeTab === index ? 'scale(1.2)' : 'scale(1)'}`
                  }}
                >
                  {/* Bulle principale */}
                  <div
                    className={cn(
                      'relative z-10 h-16 w-16 rounded-full transition-all duration-500',
                      'bg-gradient-to-br from-white/60 via-transparent to-white/30',
                      'border-2 border-white/40 backdrop-blur-sm',
                      activeTab === index
                        ? 'shadow-2xl'
                        : 'shadow-lg group-hover:shadow-xl'
                    )}
                  >
                    {/* Reflet irisé */}
                    <div
                      className={cn(
                        'absolute inset-0 rounded-full transition-all duration-1000',
                        `bg-gradient-to-br ${tab.bubble}`,
                        activeTab === index
                          ? 'opacity-40'
                          : 'opacity-20 group-hover:opacity-30'
                      )}
                    />

                    {/* Reflet principal */}
                    <div className="absolute top-2 left-2 h-4 w-4 rounded-full bg-white/60 blur-sm" />
                    <div className="absolute top-1 left-1 h-2 w-2 rounded-full bg-white/80" />

                    {/* Icône flottante */}
                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center transition-all duration-500',
                        activeTab === index
                          ? 'text-gray-700'
                          : 'text-gray-600 group-hover:text-gray-700'
                      )}
                    >
                      {tab.icon}
                    </div>

                    {/* Effet de brillance */}
                    {activeTab === index && (
                      <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
                    )}
                  </div>

                  {/* Micro-bulles */}
                  {activeTab === index && (
                    <>
                      <div
                        className="absolute -top-2 -left-2 h-3 w-3 animate-bounce rounded-full bg-white/50"
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className="absolute -right-2 -bottom-2 h-2 w-2 animate-bounce rounded-full bg-white/40"
                        style={{ animationDelay: '0.5s' }}
                      />
                      <div
                        className="absolute top-0 -right-2 h-1.5 w-1.5 animate-bounce rounded-full bg-white/60"
                        style={{ animationDelay: '1s' }}
                      />
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    'relative text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.bubble} animate-pulse bg-clip-text text-transparent`
                      : 'text-gray-600 group-hover:text-gray-700'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 transform rounded-full',
                        `bg-gradient-to-r ${tab.bubble}`
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
