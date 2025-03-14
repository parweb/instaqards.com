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

export const Gallery = () => {
  return (
    <div id="Gallery" className="flex flex-col p-10 gap-10">
      <hgroup className="text-center flex flex-col gap-4">
        <h2 className="text-4xl sm:text-5xl font-[900]">
          {translate('page.home.gallery.title')}
        </h2>

        <p className="text-gray-600 text-2xl">
          {translate('page.home.gallery.description')}
        </p>
      </hgroup>

      <div className="p-5">
        <Carousel opts={{ align: 'start', loop: true }} className="">
          <CarouselContent>
            {qards.map(qard => (
              <CarouselItem
                key={qard.url}
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
