'use client';

import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';

import type { CarouselApi } from 'components/ui/carousel';
import { cn } from 'lib/utils';
import { boldonse } from 'styles/fonts';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';

const Persona = ({
  job,
  select: [selected, setSelected],
  index,
  api
}: {
  job: { id: string; profession: string };
  select: [string | undefined, Dispatch<SetStateAction<string | undefined>>];
  index: number;
  api: CarouselApi | null;
}) => {
  return (
    <div
      className={cn(
        'flex scale-90 cursor-pointer flex-col items-center gap-2 transition-all duration-300',
        {
          'scale-100': selected === job.id
        }
      )}
      onClick={() => {
        setSelected(state => {
          const newState = state === job.id ? undefined : job.id;

          if (newState === job.id && api) {
            api.scrollTo(index, true);
          }

          return newState;
        });
      }}
    >
      <Image
        priority
        className={cn('rounded-2xl border-4 border-gray-200 shadow-lg', {
          'border-black': selected === job.id
        })}
        src={`/assets/personas/${job.id}.png`}
        alt={`IndependantCommercant ${job.profession}`}
        width={150}
        height={150}
      />

      <span
        className={cn(
          boldonse.className,
          'rounded-full bg-transparent px-4 py-2 font-light',
          {
            'bg-stone-200 text-black': selected === job.id
          }
        )}
      >
        {job.profession}
      </span>
    </div>
  );
};

export const Personas = ({
  jobs
}: {
  jobs: { id: string; profession: string }[];
}) => {
  const select = useState<string>();
  const [api, setApi] = useState<CarouselApi | null>(null);

  return (
    <Carousel
      opts={{
        dragFree: true,
        loop: true,
        duration: 1000
      }}
      plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
      setApi={setApi}
    >
      <CarouselContent>
        {jobs.map((job, index) => (
          <CarouselItem key={job.id}>
            <Persona job={job} select={select} index={index} api={api} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
