'use client';

import * as z from 'zod';
import { InstagramEmbed } from 'react-social-media-embed';

export const input = z.object({
  url: z.string().url().describe('Post URL')
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
