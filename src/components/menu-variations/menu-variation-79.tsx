'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation79: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [pulseWave, setPulseWave] = useState(false);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'from-purple-400 to-violet-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'from-pink-400 to-rose-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      color: 'from-green-400 to-emerald-500'
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
      setPulseWave(true);
      setActiveTab(newTab);
      setTimeout(() => setPulseWave(false), 1000);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 p-1">
        <div className="relative overflow-hidden bg-black/80 px-4 py-4 backdrop-blur-xl">
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
                  {/* Ondes de pulsation */}
                  {pulseWave && index === activeTab && (
                    <>
                      <div
                        className={cn(
                          'absolute inset-0 top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2',
                          `border-gradient-to-r ${tab.color}`,
                          'animate-ping opacity-60'
                        )}
                        style={{ animationDuration: '1s' }}
                      />
                      <div
                        className={cn(
                          'absolute inset-0 top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border',
                          `border-gradient-to-r ${tab.color}`,
                          'animate-ping opacity-40'
                        )}
                        style={{
                          animationDuration: '1.2s',
                          animationDelay: '0.2s'
                        }}
                      />
                      <div
                        className={cn(
                          'absolute inset-0 top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border',
                          `border-gradient-to-r ${tab.color}`,
                          'animate-ping opacity-20'
                        )}
                        style={{
                          animationDuration: '1.4s',
                          animationDelay: '0.4s'
                        }}
                      />
                    </>
                  )}

                  <div
                    className={cn(
                      'relative flex h-12 w-12 transform items-center justify-center rounded-full transition-all duration-500',
                      'group-hover:rotate-12',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl`
                        : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'
                    )}
                  >
                    {tab.icon}

                    {/* Pulsation centrale */}
                    {activeTab === index && (
                      <div
                        className={cn(
                          'absolute inset-0 rounded-full transition-all duration-500',
                          `bg-gradient-to-r ${tab.color}`,
                          pulseWave ? 'animate-pulse opacity-60' : 'opacity-30'
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
                      : 'text-gray-500 group-hover:text-gray-400'
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
