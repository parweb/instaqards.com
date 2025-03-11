'use client';

import { TikTokEmbed } from 'react-social-media-embed';

export default function Tiktok({
  postId = '7401431134904569120'
}: {
  postId?: string;
}) {
  return (
    <TikTokEmbed
      url={`https://www.tiktok.com/@epicgardening/video/${postId}`}
    />
  );
}
