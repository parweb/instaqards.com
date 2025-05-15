'use client';

import { cn } from 'lib/utils';
import React, { useState } from 'react';
import { Button } from 'components/ui/button';
import { Map, List } from 'lucide-react';

export const Switcher = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [mode, setMode] = useState<'map' | 'list'>('map');

  const Component = React.Children.toArray(children).find(
    child =>
      React.isValidElement(child) &&
      (child.props as any)?.['data-mode'] === mode
  );

  return (
    <div
      className={cn(
        className,
        'flex flex-col flex-1 self-stretch items-center'
      )}
    >
      <div className="relative flex gap-2 my-4 bg-white/70 rounded-full p-1 shadow-md border border-purple-100">
        {['map', 'list'].map(m => (
          <div key={m} className="relative flex-1 flex justify-center">
            <Button
              variant={mode === m ? 'default' : 'outline'}
              className={cn(
                'rounded-full px-6 py-2 font-semibold transition-all duration-300 flex items-center gap-2',
                mode === m ? 'z-10' : 'z-0'
              )}
              onClick={() => setMode(m as 'map' | 'list')}
            >
              {m === 'map' ? (
                <Map size={18} className="mr-1" />
              ) : (
                <List size={18} className="mr-1" />
              )}
              {m === 'map' ? 'Carte' : 'Liste'}
            </Button>
            {mode === m && (
              <span
                className="absolute left-1/2 -bottom-1.5 w-2/3 h-1 bg-purple-400 rounded-full blur-sm animate-pulse opacity-60"
                style={{ transform: 'translateX(-50%)' }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="w-full flex-1 transition-all duration-500 animate-fade-in">
        {Component && <div className="animate-fade-in-up">{Component}</div>}
      </div>
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </div>
  );
};
