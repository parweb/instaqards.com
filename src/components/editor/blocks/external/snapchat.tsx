'use client';

import * as z from 'zod';

import { trySafe } from 'helpers/trySafe';
import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Post URL', kind: 'link', just: 'url' }))
});

const placeholder =
  'https://www.snapchat.com/spotlight/W7_EDlXWTBiXAEEniNoMPwAAYdmNtb3VwcnJuAZWzQBdaAZWzQBdEAAAAAQ';

export default function Snapchat({
  url = placeholder
}: Partial<z.infer<typeof input>>) {
  const [, embedUrl] = trySafe(() => {
    const query = new URL(url);
    if (query.pathname.includes('highlight')) {
      return query.origin + query.pathname.split('/').slice(0, 5).join('/');
    } else {
      return query.origin + query.pathname;
    }
  }, placeholder);

  return (
    <iframe
      className="w-full aspect-[9/16] rounded-md"
      src={`${embedUrl}/embed`}
      height="100%"
      width="100%"
      sandbox="allow-scripts allow-same-origin allow-popups"
      allow="autoplay; camera; microphone; clipboard-write;"
      allowFullScreen={true}
      allowTransparency={true}
    />
  );
}
