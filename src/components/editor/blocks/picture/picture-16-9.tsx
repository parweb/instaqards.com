import Image from 'next/image';
import { useEffect, useState } from 'react';
import * as z from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  media: z.instanceof(File, { message: 'Image is required' }).describe(
    json({
      label: 'Image',
      kind: 'upload',
      accept: { 'image/*': [] }
    })
  )
});

const placeholder = 'https://placehold.co/480x270.png?text=16:9';
export default function Picture169({
  media = placeholder
}: Partial<{ media: string | File }>) {
  const [src, setSrc] = useState<string>(
    typeof media === 'string' ? media : placeholder
  );

  useEffect(() => {
    if (media instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setSrc(reader.result as string);
      reader.readAsDataURL(media);
    }
  }, [media]);

  return (
    <div className="bg-white rounded-md overflow-hidden aspect-video h-full flex items-center justify-center mx-auto">
      <Image priority className="object-cover" src={src} alt="Image" fill />
    </div>
  );
}
