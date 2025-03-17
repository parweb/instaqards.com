import Image from 'next/image';
import { useEffect, useState } from 'react';
import * as z from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  media: z.instanceof(File, { message: 'Logo is required' }).describe(
    json({
      label: 'Logo',
      kind: 'upload',
      accept: { 'image/*': [] }
    })
  )
});

const placeholder = 'https://placehold.co/96x96.png';
export default function LogoCircle({
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
    <div className="bg-white rounded-full overflow-hidden w-24 h-24 mx-auto flex items-center justify-center">
      <Image
        priority
        className="object-contain"
        src={src}
        alt="Logo"
        width={96}
        height={96}
      />
    </div>
  );
}
