import { translate } from 'helpers/translate';
import { Iphone } from './iphone';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from 'components/ui/carousel';

const qards = [
  { url: 'https://nora-peintures.qards.link/' },
  { url: 'https://chloe-jnr.qards.link/' },
  { url: 'https://by-ayya.qards.link/' }
];

export const Gallery = async () => {
  return (
    <div id="Gallery" className="flex flex-col gap-10 p-10">
      <hgroup className="flex flex-col gap-4 text-center">
        <h2 className="text-4xl font-[900] sm:text-5xl">
          {await translate('page.home.gallery.title')}
        </h2>

        <p className="text-2xl text-gray-600">
          {await translate('page.home.gallery.description')}
        </p>
      </hgroup>

      <div className="p-5">
        <Carousel opts={{ align: 'start', loop: true }} className="">
          <CarouselContent>
            {qards.map(qard => (
              <CarouselItem
                key={qard.url}
                className="flex justify-center md:basis-1/2 lg:basis-1/3"
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
