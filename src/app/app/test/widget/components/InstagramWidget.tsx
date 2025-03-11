'use client';

import { InstagramEmbed } from 'react-social-media-embed';

export default function InstagramWidget({ postId }: { postId: string }) {
  return (
    <InstagramEmbed
      url={`https://www.instagram.com/p/${postId}/`}
      captioned={false}
    />
  );
}
