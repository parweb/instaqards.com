import { db } from 'helpers/db';
import { getLang } from 'helpers/translate';
import { Gallery } from './section/gallery';
import { Header } from './section/header';
import { Hero } from './section/hero';
import { Price } from './section/price';

export default async function HomePage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const lang = getLang();

  const prices = await db.price.findMany({
    where: {
      product: {
        active: true
      }
    }
  });

  return (
    <div className="">
      <Header />
      <Hero bg={searchParams?.bg as string} />
      <Gallery />
      {/*<Features />*/}
      <Price lang={lang} prices={prices} />
      {/* <Testimonial /> */}
    </div>
  );
}
