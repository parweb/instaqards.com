'use client';

import { z } from 'zod';
import { TikTokEmbed } from 'react-social-media-embed';

import { json } from 'lib/utils';
import { trySafe } from 'helpers/trySafe';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Post URL', kind: 'link', just: 'url' }))
});

const placeholder =
  'https://www.tiktok.com/@epicgardening/video/7401431134904569120';
export default function Tiktok({
  url = placeholder
}: Partial<z.infer<typeof input>>) {
  [, url] = trySafe(() => {
    const query = new URL(url);
    return query.pathname;
  }, placeholder);

  return (
    <div className="flex flex-col items-center justify-center">
      <TikTokEmbed
        url={`https://www.tiktok.com${url}`}
        width={323}
        height={574.22}
      />
    </div>
  );
}
