import localFont from 'next/font/local';
import { Inter, Lora, Work_Sans, Roboto } from 'next/font/google';

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

export const calTitle = localFont({
  src: './CalSans-SemiBold.otf',
  variable: '--font-title',
  weight: '600',
  display: 'swap'
});

export const lora = Lora({
  variable: '--font-title',
  subsets: ['latin'],
  weight: '600',
  display: 'swap'
});

export const work = Work_Sans({
  variable: '--font-title',
  subsets: ['latin'],
  weight: '600',
  display: 'swap'
});

export const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: '700',
  display: 'swap'
});

export const fontMapper = {
  'font-inter': inter.variable,
  'font-cal': cal.variable,
  'font-cal-title': calTitle.variable,
  'font-lora': lora.variable,
  'font-work': work.variable,
  'font-roboto': roboto.variable
} as Record<string, string>;
