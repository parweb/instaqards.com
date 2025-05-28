'use client';

import { FacebookEmbed } from 'react-social-media-embed';
import * as z from 'zod';

import { trySafe } from 'helpers/trySafe';
import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Post URL', kind: 'link', just: 'url' }))
});

const placeholder =
  'https://www.facebook.com/andrewismusic/posts/451971596293956';

export default function Facebook({
  url = placeholder
}: Partial<z.infer<typeof input>>) {
  [, url] = trySafe(() => {
    const urlObj = new URL(url);
    return urlObj.pathname;
  }, placeholder);

  return (
    <div className="w-full overflow-hidden rounded-md border border-white bg-white">
      <FacebookEmbed
        className="w-full"
        url={`https://www.facebook.com/${url}`}
        width="100%"
      />
    </div>
  );
}
