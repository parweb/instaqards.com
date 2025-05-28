'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation64: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [vinylRotation, setVinylRotation] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="h-4 w-4" />,
      href: '/',
      color: 'from-amber-600 to-yellow-500',
      rpm: 33
    },
    {
      name: 'Search',
      icon: <Search className="h-4 w-4" />,
      href: '/explore',
      color: 'from-red-600 to-orange-500',
      rpm: 45
    },
    {
      name: 'Likes',
      icon: <Heart className="h-4 w-4" />,
      href: '/qards',
      color: 'from-purple-600 to-pink-500',
      rpm: 78
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="h-4 w-4" />,
      href: '#',
      color: 'from-green-600 to-teal-500',
      rpm: 16
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
      setVinylRotation(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      {/* Fond vintage */}
      <div className="relative bg-gradient-to-r from-amber-900 via-orange-900 to-red-900 p-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 px-4 py-4 backdrop-blur-sm">
          {/* Texture vintage */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 via-transparent to-orange-200/30" />
            {/* Rayures vintage */}
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className="absolute h-px w-full bg-amber-800/20"
                style={{ top: `${(i + 1) * 6}%` }}
              />
            ))}
          </div>

          {/* Platine vintage */}
          <div className="absolute top-2 right-4 h-8 w-8 opacity-10">
            <div className="relative h-full w-full rounded-full border-2 border-amber-800">
              <div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-amber-800" />
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-around">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-center px-3 py-2"
              >
                {/* Disque vinyle */}
                <div
                  className={cn(
                    'relative mb-2 transform transition-all duration-500 ease-out',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-115' : ''
                  )}
                >
                  {/* Ombre du disque */}
                  <div
                    className={cn(
                      'absolute inset-0 h-14 w-14 translate-x-1 translate-y-1 transform rounded-full bg-black/30 transition-all duration-500',
                      activeTab === index
                        ? 'translate-x-2 translate-y-2 opacity-60'
                        : 'opacity-30'
                    )}
                  />

                  {/* Disque vinyle principal */}
                  <div
                    className={cn(
                      'relative z-10 h-14 w-14 transform rounded-full transition-all duration-500',
                      'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
                      activeTab === index ? 'shadow-2xl' : 'shadow-lg'
                    )}
                    style={{
                      transform: `rotate(${vinylRotation * (activeTab === index ? tab.rpm / 10 : 1)}deg) ${activeTab === index ? 'scale(1.15)' : 'scale(1)'}`,
                      transition:
                        'transform 0.05s linear, box-shadow 0.5s ease-out'
                    }}
                  >
                    {/* Sillons du vinyle */}
                    <div className="absolute inset-1 rounded-full border border-gray-700/50" />
                    <div className="absolute inset-2 rounded-full border border-gray-600/30" />
                    <div className="absolute inset-3 rounded-full border border-gray-500/20" />
                    <div className="absolute inset-4 rounded-full border border-gray-400/10" />

                    {/* Centre du disque (label) */}
                    <div
                      className={cn(
                        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform',
                        'h-8 w-8 rounded-full transition-all duration-500',
                        `bg-gradient-to-r ${tab.color}`,
                        activeTab === index ? 'shadow-lg' : 'shadow-md'
                      )}
                    >
                      {/* Trou central */}
                      <div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-black" />

                      {/* Icône sur le label */}
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
                        {tab.icon}
                      </div>

                      {/* Reflet vintage */}
                      <div
                        className={cn(
                          'absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent',
                          activeTab === index ? 'opacity-60' : 'opacity-30'
                        )}
                      />
                    </div>

                    {/* Rayures et usure */}
                    {activeTab === index && (
                      <>
                        <div className="absolute top-2 left-3 h-px w-6 rotate-12 transform bg-white/10" />
                        <div className="absolute right-2 bottom-3 h-px w-4 -rotate-45 transform bg-white/10" />
                        <div className="absolute top-4 right-4 h-px w-2 rotate-90 transform bg-white/10" />
                      </>
                    )}
                  </div>

                  {/* Bras de lecture (pour l'onglet actif) */}
                  {activeTab === index && (
                    <div className="absolute -top-2 -right-1 h-1 w-6 origin-left rotate-45 transform animate-pulse rounded-full bg-gradient-to-r from-amber-600 to-yellow-500" />
                  )}

                  {/* Particules de poussière vintage */}
                  {activeTab === index && (
                    <>
                      <div
                        className="absolute -top-1 -left-1 h-1 w-1 animate-bounce rounded-full bg-amber-400 opacity-70"
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className="absolute -right-1 -bottom-1 h-0.5 w-0.5 animate-bounce rounded-full bg-orange-400 opacity-70"
                        style={{ animationDelay: '0.7s' }}
                      />
                      <div
                        className="absolute top-0 -right-1 h-0.5 w-0.5 animate-bounce rounded-full bg-red-400 opacity-70"
                        style={{ animationDelay: '1.4s' }}
                      />
                    </>
                  )}
                </div>

                {/* Label vintage */}
                <span
                  className={cn(
                    'relative text-xs font-bold transition-all duration-500',
                    'font-serif', // Police vintage
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.color} animate-pulse bg-clip-text text-transparent`
                      : 'text-amber-800 group-hover:text-amber-900'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 transform rounded-full',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                      />
                      {/* Indicateur RPM */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform font-mono text-[8px] text-amber-600">
                        {tab.rpm} RPM
                      </div>
                    </>
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Signature vintage */}
          <div className="absolute right-2 bottom-1 font-serif text-[8px] text-amber-700/50 italic">
            Est. 1950
          </div>
        </div>
      </div>
    </nav>
  );
};
