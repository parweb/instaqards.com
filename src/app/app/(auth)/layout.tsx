import Image from 'next/image';
import { type ReactNode, Suspense } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <div className="flex min-h-screen">
        <div className="flex flex-1 items-center justify-center">
          <Suspense fallback={null}>{children}</Suspense>
        </div>

        <div className="hidden flex-1 items-center justify-center lg:flex">
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
