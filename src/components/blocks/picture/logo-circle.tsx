import Image from 'next/image';
import * as z from 'zod';

export const input = z.object({
  media: z.string().url().describe('Logo')
});

export default function LogoCircle({
  media = 'https://placehold.co/96x96.png'
}: Partial<z.infer<typeof input>>) {
  return (
    <div className="bg-white rounded-full overflow-hidden w-24 h-24 flex items-center justify-center">
      <Image
        priority
        className="object-contain"
        src={media ?? ''}
        alt={'Logo'}
        width={96}
        height={96}
      />
    </div>
  );
}
