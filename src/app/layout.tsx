import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

import { cn } from 'lib/utils';
import { cookies } from 'next/headers';
import { cal, inter, open } from 'styles/fonts';
import { DEFAULT_LANG } from '../../translations';
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
  metadataBase: new URL('https://qards.link')
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={cookies().get('lang')?.value ?? DEFAULT_LANG}
      suppressHydrationWarning
    >
      <body
        className={cn(
          cal.variable,
          inter.variable,
          open.variable,
          'font-sans flex flex-col h-[100vh]'
        )}
      >
        <Providers>
          {children}
          <Analytics />
        </Providers>

        <SpeedInsights />
      </body>
    </html>
  );
}
