'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation65: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [neonPulse, setNeonPulse] = useState(0);

  const tabs = [
    {
      name: 'HOME',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      neon: 'from-cyan-400 to-blue-500',
      glitch: 'cyan'
    },
    {
      name: 'SCAN',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      neon: 'from-pink-400 to-purple-500',
      glitch: 'pink'
    },
    {
      name: 'SYNC',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      neon: 'from-green-400 to-emerald-500',
      glitch: 'green'
    },
    {
      name: 'MENU',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      neon: 'from-orange-400 to-red-500',
      glitch: 'orange'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 150);
      },
      3000 + Math.random() * 2000
    );

    const pulseInterval = setInterval(() => {
      setNeonPulse(prev => (prev + 1) % 3);
    }, 800);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Fond cyberpunk */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black p-1">
        <div className="bg-black/95 backdrop-blur-xl px-4 py-4 relative overflow-hidden">
          {/* Grille cyberpunk */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(cyan 1px, transparent 1px),
                linear-gradient(90deg, cyan 1px, transparent 1px)
              `,
                backgroundSize: '20px 20px'
              }}
            />
          </div>

          {/* Lignes de scan */}
          <div
            className={cn(
              'absolute inset-0 transition-all duration-300',
              glitchEffect ? 'opacity-60' : 'opacity-20'
            )}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent',
                  'animate-pulse'
                )}
                style={{
                  top: `${i * 12.5}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>

          {/* Particules flottantes */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse',
                  neonPulse === i % 3 ? 'opacity-100' : 'opacity-30'
                )}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-around relative z-10">
            {tabs.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(index)}
                className="flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 relative group"
              >
                {/* Hologramme container */}
                <div
                  className={cn(
                    'relative mb-2 transition-all duration-300 ease-out transform',
                    'group-hover:scale-110 group-active:scale-95',
                    activeTab === index ? 'scale-115' : '',
                    glitchEffect && activeTab === index ? 'animate-pulse' : ''
                  )}
                >
                  {/* Projection holographique */}
                  <div
                    className={cn(
                      'absolute inset-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2',
                      'border border-dashed transition-all duration-500',
                      activeTab === index
                        ? `border-${tab.glitch}-400 opacity-80`
                        : 'border-gray-600 opacity-40 group-hover:border-gray-500'
                    )}
                  />

                  {/* Effet de glitch */}
                  {glitchEffect && activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute inset-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2',
                          `bg-gradient-to-r ${tab.neon}`,
                          'opacity-20 blur-sm animate-ping'
                        )}
                      />
                      <div
                        className={cn(
                          'absolute inset-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 transform translate-x-1',
                          `bg-gradient-to-r ${tab.neon}`,
                          'opacity-10 blur-md'
                        )}
                      />
                    </>
                  )}

                  {/* Panneau holographique */}
                  <div
                    className={cn(
                      'relative z-10 w-14 h-14 transition-all duration-500 transform',
                      'bg-gradient-to-br from-gray-900 via-black to-gray-800',
                      'border-2 group-hover:rotate-3',
                      activeTab === index
                        ? `border-${tab.glitch}-400 shadow-2xl`
                        : 'border-gray-700 group-hover:border-gray-600',
                      glitchEffect && activeTab === index ? 'skew-x-1' : ''
                    )}
                    style={{
                      clipPath:
                        'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'
                    }}
                  >
                    {/* Effet néon intérieur */}
                    {activeTab === index && (
                      <div
                        className={cn(
                          'absolute inset-1 transition-all duration-500',
                          `bg-gradient-to-r ${tab.neon}`,
                          neonPulse === index % 3 ? 'opacity-30' : 'opacity-10'
                        )}
                        style={{
                          clipPath:
                            'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'
                        }}
                      />
                    )}

                    {/* Icône avec effet holographique */}
                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center transition-all duration-300',
                        activeTab === index
                          ? `text-${tab.glitch}-400`
                          : 'text-gray-500 group-hover:text-gray-400',
                        glitchEffect && activeTab === index
                          ? 'animate-pulse'
                          : ''
                      )}
                    >
                      {tab.icon}
                    </div>

                    {/* Lignes de scan sur l'icône */}
                    {activeTab === index && (
                      <>
                        <div
                          className={cn(
                            'absolute top-2 left-2 right-2 h-px transition-all duration-1000',
                            `bg-gradient-to-r ${tab.neon}`,
                            neonPulse === 0 ? 'opacity-80' : 'opacity-20'
                          )}
                        />
                        <div
                          className={cn(
                            'absolute top-1/2 left-2 right-2 h-px transition-all duration-1000',
                            `bg-gradient-to-r ${tab.neon}`,
                            neonPulse === 1 ? 'opacity-80' : 'opacity-20'
                          )}
                        />
                        <div
                          className={cn(
                            'absolute bottom-2 left-2 right-2 h-px transition-all duration-1000',
                            `bg-gradient-to-r ${tab.neon}`,
                            neonPulse === 2 ? 'opacity-80' : 'opacity-20'
                          )}
                        />
                      </>
                    )}
                  </div>

                  {/* Particules d'énergie */}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -top-1 -left-1 w-2 h-2 rounded-full animate-ping',
                          `bg-gradient-to-r ${tab.neon}`
                        )}
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className={cn(
                          'absolute -bottom-1 -right-1 w-1.5 h-1.5 rounded-full animate-ping',
                          `bg-gradient-to-r ${tab.neon}`
                        )}
                        style={{ animationDelay: '0.5s' }}
                      />
                      <div
                        className={cn(
                          'absolute top-0 -right-1 w-1 h-1 rounded-full animate-ping',
                          `bg-gradient-to-r ${tab.neon}`
                        )}
                        style={{ animationDelay: '1s' }}
                      />
                    </>
                  )}
                </div>

                {/* Label cyberpunk */}
                <span
                  className={cn(
                    'text-[10px] font-bold transition-all duration-300 relative font-mono tracking-wider',
                    activeTab === index
                      ? `bg-gradient-to-r ${tab.neon} bg-clip-text text-transparent animate-pulse`
                      : 'text-gray-500 group-hover:text-gray-400',
                    glitchEffect && activeTab === index ? 'animate-pulse' : ''
                  )}
                >
                  {tab.name}
                  {activeTab === index && (
                    <>
                      <div
                        className={cn(
                          'absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full transition-all duration-500',
                          `bg-gradient-to-r ${tab.neon}`,
                          neonPulse === index % 3
                            ? 'opacity-100 scale-x-100'
                            : 'opacity-60 scale-x-75'
                        )}
                      />
                      {/* Code d'identification */}
                      <div
                        className={cn(
                          'absolute -top-3 left-1/2 transform -translate-x-1/2 text-[6px] font-mono',
                          `text-${tab.glitch}-400`
                        )}
                      >
                        #{String(index + 1).padStart(2, '0')}
                      </div>
                    </>
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Status bar cyberpunk */}
          <div className="absolute bottom-1 left-2 text-[8px] text-cyan-400 font-mono opacity-60">
            NEURAL_LINK_ACTIVE
          </div>
          <div className="absolute bottom-1 right-2 text-[8px] text-green-400 font-mono opacity-60">
            SYNC: 100%
          </div>
        </div>
      </div>
    </nav>
  );
};
