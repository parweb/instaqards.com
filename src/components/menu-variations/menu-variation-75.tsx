'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation75: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [trailActive, setTrailActive] = useState(false);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      name: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/explore',
      color: 'from-violet-400 to-purple-500'
    },
    {
      name: 'Likes',
      icon: <Heart className="h-5 w-5" />,
      href: '/qards',
      color: 'from-rose-400 to-pink-500'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: '#',
      color: 'from-amber-400 to-orange-500'
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
      setTrailActive(true);
      setActiveTab(newTab);
      setTimeout(() => setTrailActive(false), 1000);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-1">
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
                  {/* Traînée de particules */}
                  {trailActive && index === activeTab && (
                    <>
                      {Array.from({ length: 12 }, (_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'absolute h-1 w-1 animate-ping rounded-full',
                            `bg-gradient-to-r ${tab.color}`
                          )}
                          style={{
                            left: `${Math.random() * 60 - 30 + 24}px`,
                            top: `${Math.random() * 60 - 30 + 24}px`,
                            animationDelay: `${i * 0.05}s`,
                            animationDuration: '1s'
                          }}
                        />
                      ))}
                    </>
                  )}

                  <div
                    className={cn(
                      'relative flex h-12 w-12 transform items-center justify-center rounded-2xl transition-all duration-500',
                      'group-hover:rotate-6',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl`
                        : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'
                    )}
                  >
                    {tab.icon}
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
