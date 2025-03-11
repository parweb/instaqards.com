'use client';

import { InstagramEmbed } from 'react-social-media-embed';

const Instagram = ({ postId = 'DELQtvXpG7c' }: { postId?: string }) => {
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
