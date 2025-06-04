import type { Block } from '@prisma/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import BentoUi from 'components/bento';
import { cn, json } from 'lib/utils';

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

const BentoItemLink = ({
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

const BentoItem = ({
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

  const image = (
    <img
      src={src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
    />
  );

  return (
    <div className={cn('overflow-hidden rounded-md', className)}>
      {media.kind === 'local' ? (
        image
      ) : media.link ? (
        <BentoItemLink id={media.id} blockId={blockId} link={media.link}>
          {image}
        </BentoItemLink>
      ) : (
        image
      )}
    </div>
  );
};

export default function Bento({
  medias = [
    {
      id: '4',
      kind: 'remote',
      url: 'https://placehold.co/210x290.png?text=pic'
    },
    {
      id: '5',
      kind: 'remote',
      url: 'https://placehold.co/210x290.png?text=pic'
    },
    {
      id: '6',
      kind: 'remote',
      url: 'https://placehold.co/210x290.png?text=pic'
    },
    {
      id: '7',
      kind: 'remote',
      url: 'https://placehold.co/210x290.png?text=pic'
    }
  ],
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  if (medias.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-hidden rounded-md bg-white p-4">
        No images
      </div>
    );
  }

  return (
    <BentoUi>
      {medias.map(media => (
        <BentoItem key={media.id} media={media} blockId={block?.id} />
      ))}
    </BentoUi>
  );
}
