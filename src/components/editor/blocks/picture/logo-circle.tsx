import Image from 'next/image';
import { useEffect, useState } from 'react';
import * as z from 'zod';

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
        label: 'Logo',
        kind: 'upload',
        multiple: false,
        preview: false,
        accept: { 'image/*': [] }
      })
    )
});

const placeholder = 'https://placehold.co/96x96.png';
export default function LogoCircle({
  medias: [media] = [{ id: '1', kind: 'remote', url: placeholder }]
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
    <div className="relative w-24 aspect-square mx-auto bg-white rounded-full overflow-hidden">
      <Image
        priority
        className="object-cover"
        src={src}
        alt="Logo"
        fill
        sizes="100px"
      />
    </div>
  );
}
