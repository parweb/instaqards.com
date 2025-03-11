'use client';

import { FacebookEmbed } from 'react-social-media-embed';

export default function Facebook({
  postId = '451971596293956'
}: {
  postId?: string;
}) {
  return (
    <FacebookEmbed
      url={`https://www.facebook.com/andrewismusic/posts/${postId}`}
    />
  );
}
