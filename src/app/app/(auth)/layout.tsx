import { ReactNode, Suspense } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 items-center">
        {children}
      </div>
    </Suspense>
  );
}
