import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { PriceTable } from 'components/price-table';
import { Button } from 'components/ui/button';
import { db } from 'helpers';
import { cn } from 'lib/utils';
import { translate } from 'helpers/translate';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from 'components/ui/carousel';

const Iphone = ({ url, scale = 100 }: { url: string; scale: number }) => {
  const ratio = 2283 / 1109;

  const width = 1109;
  const height = width * ratio;

  const factor = scale / 100;
  const translate = {
    10: -450,
    12.5: -350,
    20: -200,
    25: -150,
    30: -350 / 3,
    40: -75,
    50: -50,
    200: 25,
    300: 100 / 3
  }[scale];

  return (
    <div
      className="pointer-events-none"
      style={{
        width: width * factor + 'px',
        height: height * factor + 'px'
      }}
    >
      <div
        style={{
          width: width + 'px',
          height: height + 'px',
          background: 'url(/iPhone-15-Pro2.png)',
          paddingTop: '44px',
          paddingRight: '46px',
          paddingBottom: '43px',
          paddingLeft: '50px',

          scale: factor,
          // margin: '-' + 100 - 100 * scale + '% 0',
          transform: 'translate(' + translate + '%, ' + translate + '%)'
        }}
      >
        <iframe
          style={{
            transformOrigin: '0 0',
            transform: 'scale(2)',
            width: '50%',
            height: '50%',
            borderRadius: '70px'
          }}
          src={url}
        />
      </div>
    </div>
  );
};

const Header = () => {
  const ratio = 0.2;

  return (
    <div className="sticky top-0 bg-white/80 z-10">
      <div className="flex items-center justify-between pr-2 max-w-[1200px] m-auto">
        <Image
          src={`/rsz_black-transparent_nolink.png`}
          alt="Logo qards.link"
          width={800 * ratio}
          height={400 * ratio}
        />

        <Link href={(process.env.NEXTAUTH_URL as string) + '/register'}>
          <Button>{translate('page.home.register')}</Button>
        </Link>
      </div>
    </div>
  );
};

const Hero = ({ bg = '06' }) => {
  const gradient =
    'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text';

  return (
    <div
      id="Hero"
      className="relative flex flex-col bg-[#ddd] p-10 sm:p-20 items-center justify-center overflow-hidden"
    >
      <video
        className="absolute top-0 right-0 left-0 object-cover w-full h-full"
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={`/api/file?id=landing-background-video-${bg}.mp4`}
          type="video/mp4"
        />
      </video>

      <div className="z-10">
        <div className="flex gap-10 max-w-[900px] items-center flex-col md:flex-row">
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-5 text-white p-4 rounded-md">
              <div className={cn('text-5xl sm:text-7xl font-[900] b')}>
                {translate('page.home.hero.title')}
              </div>

              <div className="text-2xl">
                {translate('page.home.hero.description')}
              </div>

              <ul className="">
                <li className="flex gap-2">
                  <svg
                    className="fill-current shrink-0 w-3"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
                  </svg>

                  <span>{translate('page.home.hero.bullet.one')}</span>
                </li>

                <li className="flex gap-2">
                  <svg
                    className="fill-current shrink-0 w-3"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
                  </svg>

                  <span>{translate('page.home.hero.bullet.two')}</span>
                </li>

                <li className="flex gap-2">
                  <svg
                    className="fill-current shrink-0 w-3"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
                  </svg>

                  <span>{translate('page.home.hero.bullet.three')}</span>
                </li>
              </ul>

              <div>
                <Link href={(process.env.NEXTAUTH_URL as string) + '/register'}>
                  <Button>{translate('page.home.hero.call-to-action')}</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <Iphone url="https://gellyx.qards.link/" scale={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const qards = [
    { url: 'https://nora-peintures.qards.link/' },
    { url: 'https://chloe-jnr.qards.link/' },
    { url: 'https://by-ayya.qards.link/' }
  ];

  return (
    <div id="Gallery" className="flex flex-col p-10 gap-10">
      <hgroup className="text-center flex flex-col gap-4">
        <h2 className="text-5xl font-[900]">
          {translate('page.home.gallery.title')}
        </h2>
        <p className="text-gray-600 text-2xl">
          {translate('page.home.gallery.description')}
        </p>
      </hgroup>

      <div className="p-5">
        <Carousel opts={{ align: 'start', loop: true }} className="">
          <CarouselContent>
            {qards.map((qard, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 justify-center flex"
              >
                <Iphone url={qard.url} scale={25} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div id="Features" className="flex flex-col p-10 gap-10">
      <hgroup className="text-center flex flex-col gap-4">
        <h2 className="text-5xl font-[900]">
          {translate('page.home.features.title')}
        </h2>
        <p className="text-gray-600 text-2xl">
          {translate('page.home.features.description')}
        </p>
      </hgroup>

      <div className="">
        <p>{translate('page.home.features.bullet.one')}</p>
        <p>{translate('page.home.features.bullet.two')}</p>
        <p>{translate('page.home.features.bullet.three')}</p>
        <p>{translate('page.home.features.bullet.four')}</p>
        <p>{translate('page.home.features.bullet.five')}</p>
      </div>
    </div>
  );
};

const Prices = async () => {
  const products = await db.product.findMany({
    where: { active: { equals: true } },
    include: {
      prices: {
        where: {
          active: { equals: true },
          interval_count: { equals: 1 }
        }
      }
    }
  });

  return (
    <div id="Prices" className="flex flex-col p-10 gap-20 overflow-hidden">
      <hgroup className="text-center flex flex-col gap-4">
        <h2 className="text-5xl font-[900]">
          {translate('page.home.price.title')}
        </h2>
        <p className="text-gray-600 text-2xl">
          {translate('page.home.price.description')}
        </p>
      </hgroup>

      <div className="flex items-center justify-center">
        <PriceTable products={products} />
      </div>
    </div>
  );
};

const Testimonial = () => {
  const comments = [
    {
      id: '01',
      name: 'Spencer C.',
      text: "I've been using qards for a few months now, and the difference it has made is incredible. Highly recommended for anyone looking to improve visibility!"
    },
    {
      id: '02',
      name: 'Ashley R.',
      text: 'The team at qards went above and beyond to ensure my satisfaction. Their attention to detail and customer service is unmatched.'
    },
    {
      id: '03',
      name: 'Emma S.',
      text: "From start to finish, my experience with qards was seamless. It's clear that quality is their top priority."
    },
    {
      id: '04',
      name: 'Jamie F.',
      text: "I was hesitant at first, but I'm so glad I decided to go with qards. They've exceeded all my expectations."
    },
    {
      id: '05',
      name: 'Sonia G.',
      text: "qards has been a game-changer for me. It's rare to find something that delivers on every promise, but this does."
    },
    {
      id: '06',
      name: 'Brianna A.',
      text: 'The customer support at qards is fantastic. They were responsive, helpful, and made sure all my questions were answered.'
    },
    {
      id: '07',
      name: 'David R.',
      text: "I can't recommend qards enough. It's not just the results, but also the experience that makes them stand out."
    },
    {
      id: '08',
      name: 'Craig J.',
      text: "Investing in qards was one of the best decisions I've made. It's worth every penny."
    },
    {
      id: '09',
      name: 'Amy V.',
      text: "The level of professionalism and expertise at qards is impressive. They truly know what they're doing."
    },
    {
      id: '10',
      name: 'Terri S.',
      text: "I've tried many qards in the past, but nothing compares to this. I'm a customer for life."
    },
    {
      id: '11',
      name: 'Patrick M.',
      text: "The results speak for themselves. qards has significantly improved visibility, and I couldn't be happier."
    },
    {
      id: '12',
      name: 'Samantha D.',
      text: "qards's commitment to excellence is evident in everything they do. I'm so glad I chose them."
    },
    {
      id: '13',
      name: 'James H.',
      text: "The ease of use and effectiveness of qards is unmatched. It's an essential for anyone in music production."
    },
    {
      id: '14',
      name: 'Joshua J.',
      text: "I was blown away by the immediate results I saw with qards. It's been incredibly beneficial."
    },
    {
      id: '15',
      name: 'Thomas R.',
      text: 'The team at qards is passionate about what they do, and it shows. Their dedication to customer satisfaction is commendable.'
    },
    {
      id: '16',
      name: 'Austin M.',
      text: "Choosing qards was a turning point for me. It has brought joy into my life, and I'm grateful for the impact it's had."
    }
  ];

  return (
    <div id="Testimonial" className="flex flex-col p-5 sm:p-10 gap-20">
      <hgroup className="text-center flex flex-col gap-4">
        <h2 className="text-5xl font-[900]">
          {translate('page.home.testimonial.title')}
        </h2>
        <p className="text-gray-600 text-2xl">
          {translate('page.home.testimonial.description')}
        </p>
      </hgroup>

      <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {comments.map(comment => (
            <div
              key={`TestimonialItem-${comment.id}`}
              className="flex flex-col gap-2 p-4 border-2 border-gray-200 rounded-md"
            >
              <div className="flex gap-4 items-center justify-center">
                <Image
                  className="rounded-full"
                  src={`/face-${comment.id}.jpg`}
                  width={50}
                  height={50}
                  alt={comment.name}
                />
                <div className="">{comment.name}</div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="italic">{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default async function HomePage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="">
      <Header />

      <Hero bg={searchParams?.bg as string} />

      <Gallery />

      {/*<Features />*/}

      <Suspense fallback={null}>
        <Prices />
      </Suspense>

      <Testimonial />
    </div>
  );
}
