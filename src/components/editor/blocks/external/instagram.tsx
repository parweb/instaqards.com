'use client';

import * as z from 'zod';
import { InstagramEmbed } from 'react-social-media-embed';

import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Post URL', kind: 'string' }))
});

const Instagram = ({
  url = 'https://www.instagram.com/p/DELQtvXpG7c'
}: Partial<z.infer<typeof input>>) => {
  const postId = url?.split('/').pop();

  return (
    <>
      <InstagramEmbed
        url={`https://www.instagram.com/p/${postId}/`}
        captioned={false}
        width="100%"
      />
    </>
  );
};

export default Instagram;
