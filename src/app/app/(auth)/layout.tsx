import Image from 'next/image';
import { ReactNode, Suspense } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const ratio = 1;

  return (
    <Suspense fallback={null}>
      <div className="flex min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          {children}
        </div>

        <div className="flex-1 hidden bg-muted lg:flex items-center justify-center">
          <Image
            src={`/rsz_black-transparent_withlink.png`}
            alt="Logo qards.link"
            width={800 * ratio}
            height={400 * ratio}
          />
        </div>
      </div>
    </Suspense>
  );
}
