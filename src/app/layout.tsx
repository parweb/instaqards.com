import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { cn } from 'lib/utils';
import { cookies } from 'next/headers';
import { cal, inter, open } from 'styles/fonts';
import { DEFAULT_LANG } from 'translations';
import { Providers } from './providers';

import 'styles/globals.css';

const title = 'Reveal your self right now with qards.link';
const description = 'unforgettable in an instant';
const image = 'https://qards.link/thumbnail-og.png';

export const metadata: Metadata = {
  title,
  description,
  icons: ['https://qards.link/favicon.ico'],
  openGraph: {
    title,
    description,
    images: [image]
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
    creator: '@vercel'
  },
  metadataBase: new URL('https://qards.link'),
  alternates: {
    canonical: '/'
  }
};

const Html = async ({ children }: { children: React.ReactNode }) => {
  const lang = (await cookies()).get('lang')?.value ?? DEFAULT_LANG;

  return (
    <html lang={lang} suppressHydrationWarning>
      {children}
    </html>
  );
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <Html>
        {/* <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head> */}

        <body
          className={cn(
            cal.variable,
            inter.variable,
            open.variable,
            'font-sans flex flex-col h-[100vh] relative'
          )}
        >
          <Suspense fallback={null}>
            <Providers>
              <Suspense fallback={null}>{children}</Suspense>
              <Analytics />
            </Providers>
          </Suspense>

          <SpeedInsights />
        </body>
        <GoogleAnalytics gaId="G-XJM901XDPJ" />
      </Html>
    </Suspense>
  );
}
