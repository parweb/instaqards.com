'use client';

import * as z from 'zod';
import { InstagramEmbed } from 'react-social-media-embed';

export const input = z.object({
  url: z.string().url().optional().describe('Post URL')
});

const Instagram = ({
  url = 'https://www.instagram.com/p/DELQtvXpG7c'
}: z.infer<typeof input>) => {
  const postId = url?.split('/').pop();

  return (
    <>
      <InstagramEmbed
        url={`https://www.instagram.com/p/${postId}/`}
        captioned={false}
      />
    </>
  );
};

export default Instagram;
