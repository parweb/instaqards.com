import type { Block } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  medias: z
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
        preview: true,
        accept: { 'image/*': [] }
      })
    )
});

const placeholder = 'https://placehold.co/480x270.png?text=16:9';
export default function Picture169({
  medias: [media] = [{ id: '1', kind: 'remote', url: placeholder }],
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  media ??= { id: '1', kind: 'remote', url: placeholder };
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

  const img = (
    <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-md bg-white">
      <Image
        priority
        className="object-cover"
        src={src}
        alt="Image"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );

  return media.link ? (
    <Link
      prefetch={false}
      href={block ? `/click/${block?.id}/?id=${media?.id}` : media.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 self-stretch"
    >
      {img}
    </Link>
  ) : (
    img
  );
}
