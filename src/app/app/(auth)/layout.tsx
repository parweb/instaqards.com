import { ReactNode, Suspense } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <div className="flex min-h-screen">
        <div className="flex-1 flex items-center justify-center py-12">
          {children}
        </div>

        <div className="flex-1 hidden bg-muted lg:flex items-center justify-center">
          <span className="text-9xl font-extrabold">Q</span>
        </div>
      </div>
    </Suspense>
  );
}
