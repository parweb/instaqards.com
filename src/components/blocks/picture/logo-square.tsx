import Image from 'next/image';
import * as z from 'zod';

export const input = z.object({
  media: z.string().url().optional().describe('Logo')
});

export default function LogoSquare({
  media = 'https://placehold.co/96x96.png'
}: z.infer<typeof input>) {
  return (
    <div className="bg-white rounded-md overflow-hidden w-24 h-24 flex items-center justify-center">
      <Image
        priority
        className="object-cover"
        src={media ?? ''}
        alt={'Logo'}
        width={96}
        height={96}
      />
    </div>
  );
}
