import { db } from 'helpers/db';
import { getLang } from 'helpers/translate';
import { Gallery } from './section/gallery';
import { Hero } from './section/hero';
import { Price } from './section/price';
import { Suspense } from 'react';

export default async function HomePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const lang = await getLang();

  const prices = await db.price.findMany({
    where: { product: { active: true } }
  });

  return (
    <>
      <Hero bg={searchParams?.bg as string} />
      <Gallery />

      {/*<Features />*/}

      <Suspense fallback={null}>
        <Price
          lang={lang}
          prices={prices}
          standalone={false}
          begin
          trial
          border
        />
      </Suspense>

      {/* <Testimonial /> */}
    </>
  );
}
