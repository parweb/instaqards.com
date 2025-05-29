'use client';

import { z } from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'URL', kind: 'link', just: 'url' }))
});

export default function Iframe({
  url = 'https://qards.link/'
}: Partial<z.infer<typeof input>>) {
  return (
    <iframe
      src={url}
      width="100%"
      className="aspect-square w-full rounded-md"
    />
  );
}
