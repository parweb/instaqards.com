import * as z from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  text: z
    .string()
    .min(1, 'Text is required')
    .describe(json({ label: 'Text', kind: 'string' }))
});

export default function NormalText({
  text = 'Normal text'
}: Partial<z.infer<typeof input>>) {
  return <div className="text-center">{text}</div>;
}

export function Editor() {
  return null;
}
