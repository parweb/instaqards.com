'use client';

import { Prisma } from '@prisma/client';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';

export default function ProductMedias({
  pictures
}: {
  pictures: Prisma.MediaGetPayload<{
    select: {
      id: true;
      url: true;
    };
  }>[];
}) {
  return (
    <Carousel
      className="w-full max-w-xs"
      plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
    >
      <CarouselContent>
        {pictures.map(picture => (
          <CarouselItem key={picture.id}>
            <div className="relative aspect-square h-48">
              <Image src={picture.url} alt={''} fill className="object-cover" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
