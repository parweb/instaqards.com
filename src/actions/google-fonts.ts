'use server';

import 'server-only';

import { unstable_cache } from 'next/cache';

export type Font = {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  category: string;
  kind: string;
  menu: string;
};

export const getGoogleFonts = unstable_cache(
  async () => {
    const fonts = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_FONT_API_KEY}`
    )
      .then(res => res.json())
      .then(({ items }) => items);

    return fonts as Font[];
  },
  ['google-fonts'],
  {
    revalidate: 86400 / 4,
    tags: ['google-fonts']
  }
);
