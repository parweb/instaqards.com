'use client';

import { InstagramEmbed } from 'react-social-media-embed';
import * as z from 'zod';

import { trySafe } from 'helpers/trySafe';
import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Post URL', kind: 'link', just: 'url' }))
});

const placeholder = 'https://www.instagram.com/p/DELQtvXpG7c/';
const Instagram = ({ url = placeholder }: Partial<z.infer<typeof input>>) => {
  [, url] = trySafe(() => {
    const query = new URL(url);
    return query.pathname.split('/').filter(Boolean).join('/');
  }, placeholder);

  return (
    <div className="rounded-md overflow-hidden">
      <InstagramEmbed
        url={`https://www.instagram.com/${url}/`}
        captioned={false}
        width="100%"
      />
    </div>
  );
};

export default Instagram;
