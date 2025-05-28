'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation76: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [blobMorph, setBlobMorph] = useState(0);

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
      setBlobMorph(prev => prev + 1);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-slate-100 via-white to-slate-100 p-1">
        <div className="relative overflow-hidden bg-white/90 px-4 py-4 backdrop-blur-sm">
          {/* Blob indicateur */}
          <div
            className={cn(
              'absolute bottom-2 h-12 opacity-20 transition-all duration-700 ease-out',
              `bg-gradient-to-r ${tabs[activeTab].color}`
            )}
            style={{
              left: `${activeTab * 25}%`,
              width: '25%',
              borderRadius:
                blobMorph % 2 === 0
                  ? '60% 40% 30% 70%/60% 30% 70% 40%'
                  : '40% 60% 70% 30%/40% 70% 30% 60%',
              transition: 'border-radius 0.7s ease-in-out, left 0.7s ease-out'
            }}
          />

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
                    'relative mb-2 transform transition-all duration-500 ease-out',
                    'group-hover:scale-105 group-active:scale-95',
                    activeTab === index ? 'scale-110' : ''
                  )}
                >
                  <div
                    className={cn(
                      'relative flex h-12 w-12 transform items-center justify-center transition-all duration-500',
                      'group-hover:rotate-12',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    )}
                    style={{
                      borderRadius:
                        activeTab === index
                          ? blobMorph % 2 === 0
                            ? '60% 40% 30% 70%'
                            : '40% 60% 70% 30%'
                          : '50%',
                      transition:
                        'border-radius 0.7s ease-in-out, all 0.5s ease-out'
                    }}
                  >
                    {tab.icon}
                  </div>
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
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
