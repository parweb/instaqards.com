import Image from 'next/image';

export default function LogoCircle({
  logo = 'https://placehold.co/96x96.png',
  name = 'Logo'
}: {
  logo?: string;
  name?: string;
}) {
  return (
    <div className="bg-gray-200 rounded-full overflow-hidden w-24 h-24 flex items-center justify-center">
      <Image
        priority
        className="object-cover"
        src={logo ?? ''}
        alt={name ?? ''}
        width={96}
        height={96}
      />
    </div>
  );
}
