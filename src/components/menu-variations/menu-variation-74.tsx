'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation74: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [magneticPull, setMagneticPull] = useState(false);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'from-steel-500 to-gray-600'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'from-red-500 to-pink-600'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      color: 'from-green-500 to-emerald-600'
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
      setMagneticPull(true);
      setActiveTab(newTab);
      setTimeout(() => setMagneticPull(false), 600);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-800 via-slate-800 to-gray-800 p-1">
        <div className="relative overflow-hidden bg-gray-900/90 px-4 py-4 backdrop-blur-xl">
          {/* Champ magnétique */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'absolute h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent transition-all duration-500',
                  magneticPull ? 'opacity-60' : 'opacity-30'
                )}
                style={{
                  top: `${20 + i * 20}%`,
                  transform: `translateY(${Math.sin(Date.now() * 0.001 + i) * 2}px)`
                }}
              />
            ))}
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
                    activeTab === index ? 'scale-110' : '',
                    magneticPull && index === activeTab ? 'animate-pulse' : ''
                  )}
                >
                  {/* Particules magnétiques */}
                  {magneticPull && index === activeTab && (
                    <>
                      {Array.from({ length: 8 }, (_, i) => (
                        <div
                          key={i}
                          className="absolute h-1 w-1 animate-ping rounded-full bg-blue-400"
                          style={{
                            left: `${Math.cos((i * 45 * Math.PI) / 180) * 20 + 24}px`,
                            top: `${Math.sin((i * 45 * Math.PI) / 180) * 20 + 24}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </>
                  )}

                  <div
                    className={cn(
                      'relative flex h-12 w-12 transform items-center justify-center rounded-full transition-all duration-500',
                      'group-hover:rotate-12',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-xl`
                        : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                    )}
                  >
                    {tab.icon}

                    {/* Effet magnétique */}
                    {activeTab === index && (
                      <div
                        className={cn(
                          'absolute inset-0 rounded-full border-2 border-blue-400 transition-all duration-500',
                          magneticPull
                            ? 'scale-150 opacity-60'
                            : 'scale-100 opacity-30'
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
                      : 'text-gray-400 group-hover:text-gray-300'
                  )}
                >
                  {tab.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
