import Image from 'next/image';
import * as z from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  media: z
    .string()
    .url()
    .describe(
      json({
        label: 'Image',
        kind: 'upload',
        accept: 'image/*'
      })
    )
});

export default function Picture169({
  media = 'https://placehold.co/480x270.png?text=16:9'
}: Partial<z.infer<typeof input>>) {
  return (
    <div className="bg-white rounded-md overflow-hidden aspect-video h-full flex items-center justify-center mx-auto">
      <Image
        priority
        className="object-cover"
        src={media ?? ''}
        alt="Image"
        fill
      />
    </div>
  );
}
