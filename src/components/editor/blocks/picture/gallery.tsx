import type { Prisma } from '@prisma/client';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { cn, json } from 'lib/utils';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';

export const input = z.object({
  medias: z
    .array(
      z
        .object({
          id: z.string(),
          link: z.string().optional()
        })
        .and(
          z
            .object({
              kind: z.literal('remote'),
              url: z.string()
            })
            .or(
              z.object({
                kind: z.literal('local'),
                file: z.instanceof(File)
              })
            )
        )
    )

    .describe(
      json({
        label: 'Images',
        kind: 'upload',
        multiple: true,
        preview: true,
        linkable: true,
        accept: { 'image/*': [] }
      })
    )
});

const GalleryItemLink = ({
  id,
  blockId,
  link,
  children
}: {
  id: string;
  blockId: string | undefined;
  link: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      prefetch={false}
      href={blockId ? `/click/${blockId}/?id=${id}` : link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
};

const GalleryItem = ({
  media,
  blockId,
  className
}: {
  media: z.infer<typeof input>['medias'][number];
  blockId: string | undefined;
  className?: string;
}) => {
  const [src, setSrc] = useState<string>(
    media.kind === 'remote' ? media.url : ''
  );

  const mediaFile = media.kind === 'local' ? media.file : null;
  useEffect(() => {
    if (mediaFile) {
      const reader = new FileReader();
      reader.onloadend = () => setSrc(reader.result?.toString() ?? '');
      reader.readAsDataURL(mediaFile);
    }
  }, [mediaFile]);

  // eslint-disable-next-line @next/next/no-img-element
  const image = (
    <img
      src={src}
      alt=""
      className={cn('max-h-[200px] object-cover', className)}
    />
  );

  return (
    <div className="overflow-hidden rounded-md">
      {media.kind === 'local' ? (
        image
      ) : media.link ? (
        <GalleryItemLink id={media.id} blockId={blockId} link={media.link}>
          {image}
        </GalleryItemLink>
      ) : (
        image
      )}
    </div>
  );
};

export default function Gallery({
  medias = [
    {
      id: '4',
      kind: 'remote',
      url: 'https://placehold.co/210x290.png?text=A4'
    },
    {
      id: '5',
      kind: 'remote',
      url: 'https://placehold.co/210x290.png?text=A4'
    },
    {
      id: '6',
      kind: 'remote',
      url: 'https://placehold.co/210x290.png?text=A4'
    },
    {
      id: '7',
      kind: 'remote',
      url: 'https://placehold.co/210x290.png?text=A4'
    },
    { id: '8', kind: 'remote', url: 'https://placehold.co/210x290.png?text=A4' }
    // { id: '1', kind:'remote', url: 'https://placehold.co/480x270.png?text=16:9' },
    // { id: '2', kind:'remote', url: 'https://placehold.co/480x270.png?text=16:9' },
    // { id: '3', kind:'remote', url: 'https://placehold.co/480x270.png?text=16:9' },
    // { id: '4', kind:'remote', url: 'https://placehold.co/480x270.png?text=16:9' },
    // { id: '5', kind:'remote', url: 'https://placehold.co/480x270.png?text=16:9' },
    // { id: '6', kind:'remote', url: 'https://placehold.co/480x270.png?text=16:9' },
    // { id: '7', kind:'remote', url: 'https://placehold.co/480x270.png?text=16:9' },
    // { id: '8', kind:'remote', url: 'https://placehold.co/480x270.png?text=16:9' }
  ],
  block
}: Partial<z.infer<typeof input>> & {
  block?: Prisma.BlockGetPayload<{ select: { id: true } }>;
}) {
  if (medias.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-hidden rounded-md bg-white p-4">
        No images
      </div>
    );
  }

  if (medias.length === 1) {
    return (
      <GalleryItem
        media={medias[0]}
        blockId={block?.id}
        className="max-h-none w-full"
      />
    );
  }

  return (
    <Carousel
      opts={{ dragFree: true }}
      plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
    >
      <CarouselContent>
        {medias.map(media => (
          <CarouselItem key={media.id}>
            <GalleryItem media={media} blockId={block?.id} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
