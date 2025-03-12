'use client';

import * as z from 'zod';
import { TikTokEmbed } from 'react-social-media-embed';

export const input = z.object({
  url: z.string().url().describe('Post URL')
});

export default function Tiktok({
  url = 'https://www.tiktok.com/@epicgardening/video/7401431134904569120'
}: Partial<z.infer<typeof input>>) {
  const postId = url.split('/').pop();
  const username = url.split('/')[3];

  return (
    <TikTokEmbed url={`https://www.tiktok.com/${username}/video/${postId}`} />
  );
}
