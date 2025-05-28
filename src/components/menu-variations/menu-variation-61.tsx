'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation61: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [liquidAnimation, setLiquidAnimation] = useState(false);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'from-purple-400 to-pink-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'from-red-400 to-orange-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      color: 'from-green-400 to-teal-500'
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
      setLiquidAnimation(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      {/* Fond liquide morphing */}
      <div className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 p-1">
        <div className="relative overflow-hidden bg-black/80 px-4 py-4 backdrop-blur-xl">
          {/* Vagues liquides animées */}
          <div
            className={cn(
              'absolute inset-0 transition-all duration-[3000ms] ease-in-out',
              liquidAnimation
                ? 'translate-y-2 scale-110 transform'
                : '-translate-y-1 scale-100 transform'
            )}
          >
            <div className="absolute top-0 left-0 h-full w-full animate-pulse rounded-[50%] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20" />
            <div
              className="absolute top-2 left-4 h-20 w-20 animate-bounce rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-xl"
              style={{ animationDelay: '0.5s' }}
            />
            <div
              className="absolute top-1 right-6 h-16 w-16 animate-bounce rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-xl"
              style={{ animationDelay: '1s' }}
            />
          </div>

          <div className="relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-center px-3 py-2"
              >
                {/* Blob liquide morphing */}
                <div
                  className={cn(
                    'relative mb-2 transform transition-all duration-700 ease-out',
                    'group-hover:scale-125 group-active:scale-95',
                    activeTab === index ? 'scale-120' : ''
                  )}
                >
                  {/* Forme liquide de fond */}
                  <div
                    className={cn(
                      'absolute inset-0 transform rounded-full transition-all duration-1000 ease-in-out',
                      `bg-gradient-to-r ${tab.color}`,
                      activeTab === index
                        ? 'scale-150 animate-pulse opacity-80 blur-sm'
                        : 'scale-100 opacity-40 group-hover:scale-125 group-hover:opacity-60'
                    )}
                    style={{
                      borderRadius: liquidAnimation
                        ? '60% 40% 30% 70%/60% 30% 70% 40%'
                        : '40% 60% 70% 30%/40% 70% 30% 60%',
                      transition:
                        'border-radius 3s ease-in-out, transform 0.7s ease-out'
                    }}
                  />

                  {/* Icône avec effet liquide */}
                  <div
                    className={cn(
                      'relative z-10 transform rounded-full p-4 transition-all duration-500',
                      'group-hover:rotate-12',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl`
                        : 'bg-white/10 text-gray-300 group-hover:bg-white/20'
                    )}
                    style={{
                      borderRadius: liquidAnimation
                        ? '70% 30% 40% 60%/30% 70% 60% 40%'
                        : '30% 70% 60% 40%/70% 30% 40% 60%',
                      transition:
                        'border-radius 3s ease-in-out, all 0.5s ease-out'
                    }}
                  >
                    {tab.icon}
                  </div>

                  {/* Gouttes liquides */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-2 -left-1 h-3 w-3 animate-bounce rounded-full opacity-70',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{
                          animationDelay: '0s',
                          borderRadius: '60% 40% 30% 70%'
                        }}
                      />
                      <div
                        className={cn(
                          'absolute -right-2 -bottom-1 h-2 w-2 animate-bounce rounded-full opacity-70',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{
                          animationDelay: '0.7s',
                          borderRadius: '40% 60% 70% 30%'
                        }}
                      />
                      <div
                        className={cn(
                          'absolute top-1 -right-1 h-1.5 w-1.5 animate-bounce rounded-full opacity-70',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                        style={{
                          animationDelay: '1.4s',
                          borderRadius: '70% 30% 60% 40%'
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Label avec effet liquide */}
                <span
                  className={cn(
                    'relative text-xs font-bold transition-all duration-500',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.color} animate-pulse bg-clip-text text-transparent`
                      : 'text-gray-400 group-hover:text-gray-200'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <div
                      className={cn(
                        'absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 transform rounded-full',
                        `bg-gradient-to-r ${tab.color}`
                      )}
                      style={{
                        borderRadius: liquidAnimation
                          ? '50% 50% 0 0'
                          : '100% 0 100% 0',
                        transition: 'border-radius 3s ease-in-out'
                      }}
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
