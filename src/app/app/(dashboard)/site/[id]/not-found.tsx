import Image from 'next/image';

export default function NotFoundSite() {
  return (
    <div className="mt-20 flex flex-col items-center p-4">
      <h1 className="font-cal text-4xl">404</h1>

      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/falling.svg"
        width={400}
        height={400}
        className="dark:hidden"
      />

      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/white/falling.svg"
        width={400}
        height={400}
        className="hidden dark:block"
      />

      <p className="text-lg text-stone-500 text-center">
        Site does not exist sorry
      </p>
    </div>
  );
}
