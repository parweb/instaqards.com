import type { Site } from '@prisma/client';
import { contentType } from 'mime-types';

import { PreviewBackground } from 'components/editor/PreviewBackground';
import { cn } from 'lib/utils';

export const Background = ({
  editor = false,
  background
}: {
  editor?: boolean;
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
              className={cn('fixed top-0 left-0 w-full h-full object-cover', {
                absolute: editor
              })}
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={cn('fixed top-0 left-0 w-full h-full object-cover', {
                absolute: editor
              })}
              src={background}
              alt=""
            />
          )}

          {media_type === 'css' && (
            <div
              className={cn('fixed top-0 left-0 w-full h-full object-cover', {
                absolute: editor
              })}
            >
              <PreviewBackground name={background} />
            </div>
          )}
        </>
      )}

      {media_type === '' && (
        <div
          className={cn('fixed inset-0 bg-black/30 pointer-events-auto', {
            absolute: editor
          })}
        />
      )}
    </div>
  );
};
