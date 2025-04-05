import { Suspense } from 'react';

import { cn } from 'lib/utils';

export const Main = ({
  children,
  editor = false
}: {
  children: React.ReactNode;
  editor?: boolean;
}) => {
  return (
    <main
      className={cn(
        'flex flex-1 self-stretch items-center justify-center',
        editor === true && 'px-7'
      )}
    >
      <div className="flex flex-col gap-10 flex-1 w-full">
        <Suspense fallback={null}>{children}</Suspense>
      </div>
    </main>
  );
};
