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
  onClick,
  value
}: {
  variants: {
    id: string;
    label: string;
    type: 'button' | 'picture' | 'text' | 'external' | 'other' | 'social';
  }[];
  // eslint-disable-next-line no-unused-vars
  onClick: (data: { type: string; id: string }) => void;
  value?: { type: string; id: string };
}) => {
  return (
    <Carousel
      opts={{ dragFree: true }}
      plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
    >
      <CarouselContent>
        {variants.map(variant => (
          <CarouselItem key={variant.id}>
            <BlockTypesItemVariantsItem
              {...variant}
              onClick={onClick}
              value={value}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
