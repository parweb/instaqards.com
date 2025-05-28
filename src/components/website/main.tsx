import { Suspense } from 'react';
import { motion } from 'motion/react';

export const Main = ({
  children,
  length
}: {
  children: React.ReactNode;
  length: number;
}) => {
  return (
    <main className="flex flex-1 items-center justify-center self-stretch">
      <div className="isolate flex w-full flex-1 flex-col gap-10">
        <Suspense
          fallback={
            <div className="flex flex-1 flex-col gap-10 self-stretch">
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
                  className="h-48 w-full animate-pulse rounded-md bg-stone-200/20"
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
