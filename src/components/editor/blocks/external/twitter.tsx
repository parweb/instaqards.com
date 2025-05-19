'use client';

import { XEmbed } from 'react-social-media-embed';
import * as z from 'zod';

import { trySafe } from 'helpers/trySafe';
import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Tweet URL', kind: 'link', just: 'url' }))
});

const placeholder = 'https://x.com/mckaywrigley/status/1898756745545252866';
export default function Twitter({
  url = placeholder
}: Partial<z.infer<typeof input>>) {
  [, url] = trySafe(() => {
    const query = new URL(url);
    return query.origin + query.pathname;
  }, placeholder);

  const tweetId = url.split('/').pop();
  const username = url.split('/')[3];

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <XEmbed
        url={`https://x.com/${username}/status/${tweetId}`}
        width="100%"
        // className="flex-1 self-stretch flex flex-col justify-center [& *]:max-w-none [& iframe]:w-full [&>div]:flex [&>div]:justify-center [&>div]:items-center [&>div]:w-full [&>div]:h-full [&>div]:max-h-[500px] [&>div]:rounded-lg [&>div]:overflow-hidden [&>div]:bg-gray-100 [&>div]:border [&>div]:border-gray-200 [&>div]:shadow-md [&>div]:shadow-gray-200"
      />
    </div>
  );
}
