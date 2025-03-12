'use client';

import * as z from 'zod';
import { FacebookEmbed } from 'react-social-media-embed';

export const input = z.object({
  url: z.string().url().describe('Post URL')
});

export default function Facebook({
  url = 'https://www.facebook.com/andrewismusic/posts/451971596293956'
}: Partial<z.infer<typeof input>>) {
  const postId = url.split('/').pop();

  return (
    <FacebookEmbed
      url={`https://www.facebook.com/andrewismusic/posts/${postId}`}
    />
  );
}
