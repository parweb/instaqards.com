import Image from 'next/image';
import { type ReactNode, Suspense } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <div className="flex min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          {children}
        </div>

        <div className="flex-1 hidden lg:flex items-center justify-center">
          <Image
            className="rounded-lg"
            src="/splash.jpg"
            alt="Logo qards.link"
            width={500}
            height={500}
          />
        </div>
      </div>
    </Suspense>
  );
}
