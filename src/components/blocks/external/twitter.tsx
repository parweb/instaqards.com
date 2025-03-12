'use client';

import * as z from 'zod';
import { XEmbed } from 'react-social-media-embed';

export const input = z.object({
  url: z.string().url().describe('Tweet URL')
});

export default function Twitter({
  url = 'https://x.com/mckaywrigley/status/1898756745545252866'
}: Partial<z.infer<typeof input>>) {
  const tweetId = url.split('/').pop();
  const username = url.split('/')[3];

  return <XEmbed url={`https://x.com/${username}/status/${tweetId}`} />;
}
