'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, MoreHorizontal, Mic, MicOff } from 'lucide-react';
import { cn } from 'lib/utils';

export const MenuVariation91: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceWaves, setVoiceWaves] = useState<number[]>([]);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  const tabs = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      color: 'from-blue-400 to-cyan-400',
      voiceCommand: 'home'
    },
    {
      name: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/explore',
      color: 'from-purple-400 to-pink-400',
      voiceCommand: 'search'
    },
    {
      name: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      href: '/qards',
      color: 'from-red-400 to-orange-400',
      voiceCommand: 'likes'
    },
    {
      name: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      href: '#',
      color: 'from-green-400 to-teal-400',
      voiceCommand: 'more'
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const el = tabRefs.current[activeTab];
      if (el) {
        const rect = el.getBoundingClientRect();
        const parentRect = el.parentElement?.getBoundingClientRect();
        if (parentRect) {
          setIndicator({
            left: rect.left - parentRect.left,
            width: rect.width
          });
        }
      }
    };
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  // Animation des ondes vocales
  useEffect(() => {
    if (isListening) {
      const animateWaves = () => {
        setVoiceWaves(Array.from({ length: 5 }, () => Math.random() * 100));
        animationRef.current = requestAnimationFrame(animateWaves);
      };
      animationRef.current = requestAnimationFrame(animateWaves);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setVoiceWaves([]);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening]);

  const toggleVoiceCommand = () => {
    setIsListening(!isListening);
    // Simulation d'une commande vocale après 3 secondes
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        // Simulation: navigation vers un onglet aléatoire
        const randomTab = Math.floor(Math.random() * tabs.length);
        setActiveTab(randomTab);
      }, 3000);
    }
  };

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-1">
        <div className="bg-black/90 backdrop-blur-lg px-4 py-4 relative overflow-hidden">
          {/* Bouton microphone */}
          <button
            onClick={toggleVoiceCommand}
            className={cn(
              'absolute top-2 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Ondes vocales */}
          {isListening && (
            <div className="absolute top-2 right-14 flex items-center space-x-1">
              {voiceWaves.map((height, index) => (
                <div
                  key={index}
                  className="w-1 bg-red-400 rounded-full transition-all duration-100"
                  style={{
                    height: `${Math.max(4, height * 0.2)}px`,
                    opacity: 0.7 + height * 0.003
                  }}
                />
              ))}
            </div>
          )}

          {/* Indicateur de commande vocale */}
          {isListening && (
            <div className="absolute top-12 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
              {`Dites: "${tabs.map(t => t.voiceCommand).join('", "')}"`}
            </div>
          )}

          {/* Indicateur principal */}
          {indicator && (
            <div
              className={cn(
                'absolute bottom-6 h-1 rounded-full transition-all duration-700',
                `bg-gradient-to-r ${tabs[activeTab].color}`
              )}
              style={{
                left: indicator.left,
                width: indicator.width
              }}
            />
          )}

          <div className="flex items-center justify-around relative z-10">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                ref={el => {
                  tabRefs.current[index] = el;
                }}
                className="flex-1 flex flex-col items-center"
              >
                <Link
                  href={tab.href}
                  onClick={() => setActiveTab(index)}
                  className="flex flex-col items-center justify-center px-3 py-2 min-w-0 w-full relative group"
                >
                  <div
                    className={cn(
                      'relative mb-2 transition-all duration-500 ease-out transform',
                      'group-hover:scale-110 group-active:scale-95',
                      activeTab === index ? 'scale-110' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 transform relative',
                        'group-hover:rotate-3',
                        activeTab === index
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                          : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'
                      )}
                    >
                      {tab.icon}

                      {/* Indicateur de reconnaissance vocale */}
                      {isListening && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                      )}

                      {/* Effet de pulsation pour l'onglet actif */}
                      {activeTab === index && (
                        <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-bold transition-all duration-300 relative',
                      activeTab === index
                        ? `bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                        : 'text-gray-400 group-hover:text-gray-300'
                    )}
                  >
                    {tab.name}
                  </span>

                  {/* Commande vocale */}
                  {isListening && (
                    <span className="text-xs text-red-400 mt-1 opacity-75">
                      {`"${tab.voiceCommand}"`}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Overlay d'écoute */}
          {isListening && (
            <div className="absolute inset-0 bg-red-500/5 pointer-events-none animate-pulse" />
          )}
        </div>
      </div>
    </nav>
  );
};
