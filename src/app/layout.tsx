import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import Script from 'next/script';

import { cn } from 'lib/utils';
import { cookies } from 'next/headers';
import { cal, inter } from 'styles/fonts';
import 'styles/globals.css';
import { DEFAULT_LANG } from '../../translations';
import { Providers } from './providers';

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

        <Script id="counterscale-script-init" strategy="afterInteractive">
          {`(function () {
            debugger;
              window.counterscale = {
                  q: [["set", "siteId", "b9e25c8d-2282-4ad3-ab4c-27818a51b910"], ["trackPageview"]],
              };
          })();`}
        </Script>

        <Script
          id="counterscale-script"
          src="https://counterscale.parweb.workers.dev/tracker.js"
          strategy="beforeInteractive"
        ></Script>
      </body>
    </html>
  );
}
