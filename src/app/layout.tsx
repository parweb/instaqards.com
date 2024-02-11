import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';

import { cn } from 'lib/utils';
import { cal, inter } from 'styles/fonts';
import 'styles/globals.css';
import { Providers } from './providers';

const title = 'Reveal your self right now with qards.link';
const description = 'bla bla bla';
const image = 'https://vercel.pub/thumbnail.png';

export const metadata: Metadata = {
  title,
  description,
  icons: ['https://vercel.pub/favicon.ico'],
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
  metadataBase: new URL('https://vercel.pub')
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
