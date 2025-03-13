'use client';

import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

import { BlockTypesItemVariantsItem } from './BlockTypesItemVariantsItem';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';

export const BlockTypesItemVariants = ({
  variants,
  onClick
}: {
  variants: {
    id: string;
    label: string;
    type: 'button' | 'picture' | 'text' | 'external';
  }[];
  onClick: (data: { type: string; id: string }) => void;
}) => {
  return (
    <Carousel
      opts={{ dragFree: true }}
      plugins={[WheelGesturesPlugin({ forceWheelAxis: undefined /* 'y' */ })]}
    >
      <CarouselContent>
        {variants.map(variant => (
          <CarouselItem key={variant.id}>
            <BlockTypesItemVariantsItem {...variant} onClick={onClick} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
