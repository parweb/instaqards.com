'use client';

import { TikTokEmbed } from 'react-social-media-embed';

export const TiktokWidget = ({ postId }: { postId: string }) => {
  return (
    <>
      <TikTokEmbed
        url={`https://www.tiktok.com/@epicgardening/video/${postId}`}
      />
    </>
  );
};
