import type { Site } from '@prisma/client';
import { contentType } from 'mime-types';
import Image from 'next/image';

import { PreviewBackground } from 'components/editor/PreviewBackground';

export const Background = ({
  background
}: {
  background: Site['background'];
}) => {
  const media_type = background?.startsWith('component:')
    ? 'css'
    : contentType(background?.split('/').pop() ?? '') || '';

  return (
    <div className="absolute inset-0 group pointer-events-auto">
      {background && (
        <>
          {media_type?.startsWith('video/') && (
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              preload="auto"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={background} type="video/mp4" />
            </video>
          )}

          {media_type?.startsWith('image/') && (
            <div className="absolute top-0 left-0 w-full h-full object-cover">
              <Image
                src={background}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          {media_type === 'css' && (
            <div className="absolute top-0 left-0 w-full h-full object-cover">
              <PreviewBackground name={background} />
            </div>
          )}
        </>
      )}

      {media_type === '' && (
        <div className="absolute inset-0 bg-black/30 pointer-events-auto" />
      )}
    </div>
  );
};
