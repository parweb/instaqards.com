'use client';

import { XEmbed } from 'react-social-media-embed';

export default function Twitter({
  tweetId = '1898756745545252866'
}: {
  tweetId?: string;
}) {
  return <XEmbed url={`https://x.com/mckaywrigley/status/${tweetId}`} />;
}
