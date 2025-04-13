'use client';

import * as z from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'URL', kind: 'string' }))
});

export default function Iframe({
  url = 'https://qards.link/'
}: Partial<z.infer<typeof input>>) {
  return (
    <iframe src={url} width="100%" className="aspect-video w-full rounded-lg" />
  );
}
