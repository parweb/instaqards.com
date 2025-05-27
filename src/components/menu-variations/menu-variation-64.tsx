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
      icon: <Home className="w-4 h-4" />,
      href: '/',
      color: 'from-amber-600 to-yellow-500',
      rpm: 33
    },
    {
      name: 'Search',
      icon: <Search className="w-4 h-4" />,
      href: '/explore',
      color: 'from-red-600 to-orange-500',
      rpm: 45
    },
    {
      name: 'Likes',
      icon: <Heart className="w-4 h-4" />,
      href: '/qards',
      color: 'from-purple-600 to-pink-500',
      rpm: 78
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-4 h-4" />,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Fond vintage */}
      <div className="relative bg-gradient-to-r from-amber-900 via-orange-900 to-red-900 p-1">
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 backdrop-blur-sm px-4 py-4 relative overflow-hidden">
          {/* Texture vintage */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 via-transparent to-orange-200/30" />
            {/* Rayures vintage */}
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-amber-800/20"
                style={{ top: `${(i + 1) * 6}%` }}
              />
            ))}
          </div>

          {/* Platine vintage */}
          <div className="absolute top-2 right-4 w-8 h-8 opacity-10">
            <div className="w-full h-full border-2 border-amber-800 rounded-full relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-800 rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-around relative z-10">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className="flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 relative group"
              >
                {/* Disque vinyle */}
                <div
                  className={cn(
                    'relative mb-2 transition-all duration-500 ease-out transform',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-115' : ''
                  )}
                >
                  {/* Ombre du disque */}
                  <div
                    className={cn(
                      'absolute inset-0 w-14 h-14 rounded-full bg-black/30 transition-all duration-500 transform translate-x-1 translate-y-1',
                      activeTab === index
                        ? 'translate-x-2 translate-y-2 opacity-60'
                        : 'opacity-30'
                    )}
                  />

                  {/* Disque vinyle principal */}
                  <div
                    className={cn(
                      'relative z-10 w-14 h-14 rounded-full transition-all duration-500 transform',
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
                        'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                        'w-8 h-8 rounded-full transition-all duration-500',
                        `bg-gradient-to-r ${tab.color}`,
                        activeTab === index ? 'shadow-lg' : 'shadow-md'
                      )}
                    >
                      {/* Trou central */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full" />

                      {/* Icône sur le label */}
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
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
                        <div className="absolute top-2 left-3 w-6 h-px bg-white/10 transform rotate-12" />
                        <div className="absolute bottom-3 right-2 w-4 h-px bg-white/10 transform -rotate-45" />
                        <div className="absolute top-4 right-4 w-2 h-px bg-white/10 transform rotate-90" />
                      </>
                    )}
                  </div>

                  {/* Bras de lecture (pour l'onglet actif) */}
                  {activeTab === index && (
                    <div className="absolute -top-2 -right-1 w-6 h-1 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full transform rotate-45 origin-left animate-pulse" />
                  )}

                  {/* Particules de poussière vintage */}
                  {activeTab === index && (
                    <>
                      <div
                        className="absolute -top-1 -left-1 w-1 h-1 bg-amber-400 rounded-full animate-bounce opacity-70"
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className="absolute -bottom-1 -right-1 w-0.5 h-0.5 bg-orange-400 rounded-full animate-bounce opacity-70"
                        style={{ animationDelay: '0.7s' }}
                      />
                      <div
                        className="absolute top-0 -right-1 w-0.5 h-0.5 bg-red-400 rounded-full animate-bounce opacity-70"
                        style={{ animationDelay: '1.4s' }}
                      />
                    </>
                  )}
                </div>

                {/* Label vintage */}
                <span
                  className={cn(
                    'text-xs font-bold transition-all duration-500 relative',
                    'font-serif', // Police vintage
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent animate-pulse`
                      : 'text-amber-800 group-hover:text-amber-900'
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full',
                          `bg-gradient-to-r ${tab.color}`
                        )}
                      />
                      {/* Indicateur RPM */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[8px] text-amber-600 font-mono">
                        {tab.rpm} RPM
                      </div>
                    </>
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Signature vintage */}
          <div className="absolute bottom-1 right-2 text-[8px] text-amber-700/50 font-serif italic">
            Est. 1950
          </div>
        </div>
      </div>
    </nav>
  );
};
