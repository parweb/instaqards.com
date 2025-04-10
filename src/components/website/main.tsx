import { Suspense } from 'react';

import { cn } from 'lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export const Main = ({
  children,
  editor = false,
  length
}: {
  children: React.ReactNode;
  editor?: boolean;
  length: number;
}) => {
  return (
    <main
      className={cn(
        'flex flex-1 self-stretch items-center justify-center',
        editor === true && 'px-7'
      )}
    >
      <div className="flex flex-col gap-10 flex-1 w-full isolate">
        <Suspense
          fallback={
            <div className="flex flex-col gap-10 flex-1 self-stretch">
              {Array.from({ length }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, translateY: 100 }}
                  animate={{
                    opacity: 1,
                    translateY: 0,
                    transition: { delay: index * 0.3 }
                  }}
                  exit={{ opacity: 0, translateY: -100 }}
                  className="w-full h-48 animate-pulse bg-stone-200/20 rounded-md"
                />
              ))}
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </main>
  );
};
