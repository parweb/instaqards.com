'use client';

import { BlockTypesItemVariantsItem } from './BlockTypesItemVariantsItem';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';

export const BlockTypesItemVariants = ({
  selected,
  variants
}: {
  selected: number;
  variants: { id: string; label: string; type: 'button' }[];
}) => {
  return (
    <Carousel opts={{ dragFree: true }}>
      <CarouselContent>
        {variants.map(variant => (
          <CarouselItem key={variant.id}>
            <BlockTypesItemVariantsItem {...variant} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

// export const BlockTypesItemVariants = ({
//   selected,
//   variants
// }: {
//   selected: number;
//   variants: { id: string; label: string; type: 'button' }[];
// }) => {
//   const scrollable = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (scrollable.current === null) return;

//     scrollable.current.scrollTo({
//       left: selected * 200,
//       behavior: 'smooth'
//     });
//   }, [selected]);

//   useEffect(() => {
//     if (scrollable.current === null) return;

//     const controller = new AbortController();

//     scrollable.current.addEventListener(
//       'wheel',
//       e => {
//         if (scrollable.current === null) return;

//         e.preventDefault();
//         scrollable.current.scrollLeft += e.deltaY;
//       },
//       { signal: controller.signal, passive: false }
//     );

//     return () => controller.abort();
//   }, []);

//   return (
//     <div ref={scrollable} className="w-full overflow-x-scroll">
//       <div className="inline-flex gap-2">
//         {variants.map(variant => (
//           <BlockTypesItemVariantsItem key={variant.id} {...variant} />
//         ))}
//       </div>
//     </div>
//   );
// };
