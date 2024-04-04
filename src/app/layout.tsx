import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';

import { cn } from 'lib/utils';
import { cal, inter } from 'styles/fonts';
import 'styles/globals.css';
import { Providers } from './providers';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '../../translations';

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
        className={cn(cal.variable, inter.variable, 'flex flex-col h-[100vh]')}
      >
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
