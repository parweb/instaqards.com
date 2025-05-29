import type { Block } from '@prisma/client';
import Link from 'next/link';
import { useEffect, useRef, useState, type FC } from 'react';
import BubbleUI from 'react-bubble-ui';
import { z } from 'zod';

import ImageFullscreen from 'components/modal/image-fullscreen';
import { json } from 'lib/utils';

import 'react-bubble-ui/dist/index.css';

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
        accept: { 'image/*': [] }
      })
    )
});

const BubbleItemLink: FC<{
  id: string;
  blockId: string | undefined;
  link: string;
  children: React.ReactNode;
}> = ({ id, blockId, link, children }) => {
  return (
    <Link
      prefetch={false}
      href={blockId ? `/click/${blockId}/?id=${id}` : link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {children}
    </Link>
  );
};

const BubbleItem: FC<{
  media: z.infer<typeof input>['medias'][number];
  blockId: string | undefined;
  className?: string;
}> = ({ media, blockId, className }) => {
  const [src, setSrc] = useState<string>(
    media.kind === 'remote' ? media.url : ''
  );
  const [showFullscreen, setShowFullscreen] = useState(false);

  const mediaFile = media.kind === 'local' ? media.file : null;
  useEffect(() => {
    if (mediaFile) {
      const reader = new FileReader();
      reader.onloadend = () => setSrc(reader.result?.toString() ?? '');
      reader.readAsDataURL(mediaFile);
    }
  }, [mediaFile]);

  // Référence pour obtenir la position de l'image
  const imageRef = useRef<HTMLButtonElement>(null);
  const [initialPosition, setInitialPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  // Fonction pour ouvrir l'image en plein écran
  const handleImageClick = (e: React.MouseEvent) => {
    // Si l'image a un lien, laissez le comportement par défaut (navigation)
    // Sinon, ouvrez l'image en plein écran
    if (!media.link) {
      e.preventDefault();
      e.stopPropagation();

      // Calculer la position initiale pour l'animation
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Utiliser les coordonnées absolues (incluant le défilement)
        setInitialPosition({
          x: rect.left + scrollX,
          y: rect.top + scrollY,
          width: rect.width,
          height: rect.height
        });
      }

      setShowFullscreen(true);
    }
  };

  // Fonction pour gérer l'événement clavier (accessibilité)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!media.link && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.stopPropagation();
      setShowFullscreen(true);
    }
  };

  // eslint-disable-next-line @next/next/no-img-element
  const image = (
    <button
      ref={imageRef}
      type="button"
      className={`${className} border-0 bg-transparent p-0`}
      onClick={handleImageClick}
      onKeyDown={handleKeyDown}
      aria-label="Ouvrir l'image en plein écran"
      style={{ cursor: media.link ? 'pointer' : 'zoom-in' }}
    >
      <img
        src={src}
        alt=""
        className="h-full w-full rounded-full object-cover"
      />
    </button>
  );

  return (
    <>
      {media.kind === 'local' ? (
        image
      ) : media.link ? (
        <BubbleItemLink id={media.id} blockId={blockId} link={media.link}>
          {image}
        </BubbleItemLink>
      ) : (
        image
      )}

      {showFullscreen && (
        <ImageFullscreen
          src={src}
          initialPosition={initialPosition}
          onClose={() => setShowFullscreen(false)}
        />
      )}
    </>
  );
};

type AppleWatchProps = {
  medias?: z.infer<typeof input>['medias'];
  block?: Block;
};

const AppleWatch: FC<AppleWatchProps> = ({
  medias = [
    {
      id: '1',
      kind: 'remote' as const,
      url: 'https://placehold.co/210x290.png?text=1'
    },
    {
      id: '2',
      kind: 'remote' as const,
      url: 'https://placehold.co/210x290.png?text=2'
    },
    {
      id: '3',
      kind: 'remote' as const,
      url: 'https://placehold.co/210x290.png?text=3'
    },
    {
      id: '4',
      kind: 'remote' as const,
      url: 'https://placehold.co/210x290.png?text=4'
    },
    {
      id: '5',
      kind: 'remote' as const,
      url: 'https://placehold.co/210x290.png?text=5'
    }
  ],
  block
}) => {
  if (medias.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-hidden rounded-md bg-white p-4">
        No images
      </div>
    );
  }

  const options = {
    size: 180,
    minSize: 20,
    gutter: 8,
    provideProps: true,
    numCols: Math.ceil(Math.sqrt(medias.length)),
    fringeWidth: 100,
    yRadius: 150,
    xRadius: 150,
    cornerRadius: 70,
    showGuides: false,
    compact: true,
    gravitation: 5
  };

  return (
    <div className="aspect-square w-full">
      <BubbleUI options={options} className="myBubbleUI">
        {medias.map(media => (
          <BubbleItem
            key={media.id}
            media={media}
            blockId={block?.id}
            className="child"
          />
        ))}
      </BubbleUI>

      <style jsx global>{`
        .myBubbleUI {
          width: 100%;
          height: 100%;
          border-radius: 50px;
        }

        .child {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AppleWatch;
