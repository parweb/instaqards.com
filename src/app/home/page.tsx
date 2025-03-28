import { db } from 'helpers/db';
import { getLang } from 'helpers/translate';
import { Gallery } from './section/gallery';
import { Header } from './section/header';
import { Hero } from './section/hero';
import { Price } from './section/price';

export default async function HomePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const lang = await getLang();

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
