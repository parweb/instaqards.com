'use client';

import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import Image from 'next/image';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { useState } from 'react';

import type { CarouselApi } from 'components/ui/carousel';
import { Job } from 'data/job';
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
  api,
  linkable
}: {
  job: {
    id: Job['id'];
    profession: Job['profession'][keyof Job['profession']];
  };
  select: [Job['id'], (value: Job['id']) => void];
  index: number;
  api: CarouselApi | null;
  linkable: boolean;
}) => {
  if (linkable) {
    return (
      <Link
        prefetch
        href={`/pro/${job.id}`}
        className={cn(
          'flex flex-col gap-2 items-center cursor-pointer transition-all duration-300 scale-90',
          {
            'scale-100': selected === job.id
          }
        )}
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
            'font-light bg-transparent rounded-full py-2 px-4',
            {
              'text-black bg-stone-200': selected === job.id
            }
          )}
        >
          {job.profession}
        </span>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-2 items-center cursor-pointer transition-all duration-300 scale-90',
        {
          'scale-100': selected === job.id
        }
      )}
      onClick={() => {
        const newState = selected === job.id ? undefined : job.id;
        if (newState === job.id && api) {
          api.scrollTo(index, true);
        }
        // @ts-expect-error
        setSelected(newState);
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
          'font-light bg-transparent rounded-full py-2 px-4',
          {
            'text-black bg-stone-200': selected === job.id
          }
        )}
      >
        {job.profession}
      </span>
    </div>
  );
};

export const Personas = ({
  jobs,
  linkable = false
}: {
  jobs: {
    id: Job['id'];
    profession: Job['profession'][keyof Job['profession']];
  }[];
  linkable?: boolean;
}) => {
  const select = useQueryState<Job['id']>('select', {
    shallow: false,
    parse: v => v as Job['id'],
    serialize: v => v ?? '',
    defaultValue: jobs[0].id
  });

  const [api, setApi] = useState<CarouselApi | null>(null);

  return (
    <Carousel
      opts={{
        dragFree: true,
        loop: true
      }}
      plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
      setApi={setApi}
    >
      <CarouselContent>
        {jobs.map((job, index) => (
          <CarouselItem key={job.id}>
            <Persona
              job={job}
              select={select}
              index={index}
              api={api}
              linkable={linkable}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
