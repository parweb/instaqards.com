'use client';

import * as z from 'zod';
import Image from 'next/image';

import { json } from 'lib/utils';

import { useEffect, useState } from 'react';
export const input = z.object({
  images: z
    .array(
      z
        .object({
          id: z.string(),
          link: z.string().optional()
        })
        .and(
          z
            .object({
              kind: z.literal('remote'),
              url: z.string()
            })
            .or(
              z.object({
                kind: z.literal('local'),
                file: z.instanceof(File)
              })
            )
        )
    )
    .describe(
      json({
        label: 'Image',
        kind: 'upload',
        multiple: false,
        preview: false,
        accept: { 'image/*': [] }
      })
    ),
  name: z.string().describe(json({ label: 'Nom', kind: 'string' })),
  description: z
    .string()
    .describe(json({ label: 'Description', kind: 'string' }))
});

const placeholder = 'https://placehold.co/96x96.png';
export default function Profile({
  images: [media] = [{ id: '1', kind: 'remote', url: placeholder }],
  name = 'Nom',
  description = 'Description'
}: Partial<z.infer<typeof input>>) {
  const [src, setSrc] = useState<string>(
    media.kind === 'remote' ? media.url : ''
  );

  const mediaFile = media.kind === 'local' ? media.file : null;
  useEffect(() => {
    if (mediaFile) {
      const reader = new FileReader();
      reader.onloadend = () => setSrc(reader.result?.toString() ?? '');
      reader.readAsDataURL(mediaFile);
    }
  }, [mediaFile]);

  return (
    <header className="flex-1 flex flex-col justify-center items-center gap-4">
      <div className="relative w-24 aspect-square mx-auto bg-white rounded-full overflow-hidden">
        <Image
          priority
          src={src}
          alt={name ?? 'Logo'}
          className="object-cover"
          fill
          sizes="100px"
        />
      </div>

      <h1 className="text-white text-4xl font-bold">{name}</h1>

      <div className="">
        <p className="text-center whitespace-pre-wrap">{description}</p>
      </div>
    </header>
  );
}
