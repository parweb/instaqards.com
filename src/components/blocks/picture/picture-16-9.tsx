import Image from 'next/image';

export default function Picture169({
  image = 'https://placehold.co/480x270.png?text=16:9',
  name = 'Image'
}: {
  image: string;
  name: string;
}) {
  return (
    <div className="bg-gray-200 rounded-md overflow-hidden aspect-video h-full flex items-center justify-center">
      <Image
        priority
        className="object-cover"
        src={image ?? ''}
        alt={name ?? ''}
        fill
      />
    </div>
  );
}
