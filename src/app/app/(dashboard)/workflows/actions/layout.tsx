import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from 'components/ui/button';
import { db } from 'helpers/db';
import { cn } from 'lib/utils';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';

export default async function WorkflowActionsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const types = await db.action
    .findMany({
      select: {
        type: true
      },
      distinct: ['type']
    })
    .then(actions => actions.map(action => action.type));

  return (
    <div className="flex flex-col space-y-6">
      <Carousel opts={{ align: 'start', loop: true }} className="">
        <CarouselContent>
          {types.map(type => (
            <CarouselItem key={type} className="flex">
              <Button
                asChild
                type="submit"
                className={cn(
                  'bg-cover bg-center transition-all duration-300',
                  {
                    'opacity-40': false,
                    'opacity-100': false
                  }
                )}
                style={{
                  backgroundImage: `url("https://avatar.vercel.sh/${type}")`,
                  textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                }}
              >
                <Link prefetch href={`/workflows/actions/${type}`}>
                  {type}
                </Link>
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
