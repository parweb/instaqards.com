import Image from 'next/image';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  size: z
    .number()
    .default(100)
    .describe(
      json({
        label: 'Taille',
        kind: 'range',
        min: 50,
        max: 350,
        step: 1,
        defaultValue: 100
      })
    ),

  corner: z.number().describe(
    json({
      label: 'Arrondi',
      kind: 'range',
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 100
    })
  ),

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
        label: 'Logo',
        kind: 'upload',
        multiple: false,
        preview: false,
        accept: { 'image/*': [] }
      })
    )
});

const placeholder = 'https://placehold.co/96x96.png?text=1:1';
export default function LogoCircle({
  medias: [media] = [{ id: '1', kind: 'remote', url: placeholder }],
  size = 100,
  corner = 100
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
    <div
      style={{ width: `${size}px`, borderRadius: `${corner}%` }}
      className="relative mx-auto aspect-square overflow-hidden bg-white"
    >
      <Image
        priority
        className="object-cover"
        src={
          src === placeholder ? src.replace('96x96', `${size}x${size}`) : src
        }
        alt="Logo"
        fill
        sizes={`${size}px`}
      />
    </div>
  );
}
