import { Inter, Open_Sans } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
});

export const cal = localFont({
  src: './CalSans-SemiBold.otf',
  variable: '--font-cal',
  weight: '600',
  display: 'swap'
});

export const open = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin']
});
