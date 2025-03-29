import { Suspense } from 'react';

export const Footer = ({ children }: { children: React.ReactNode }) => {
  return (
    <footer className="flex flex-col gap-3">
      <Suspense fallback={null}>{children}</Suspense>
    </footer>
  );
};
