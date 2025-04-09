'use client';

import type { Site } from '@prisma/client';
import { motion } from 'framer-motion';
import { contentType } from 'mime-types';
import Image from 'next/image';
import { RefObject, Suspense } from 'react';

import { PreviewBackground } from 'components/editor/PreviewBackground';
import { cn } from 'lib/utils';

export const Background = ({
  background,
  autoPlay = true,
  state,
  videoRef
}: {
  background: Site['background'];
  autoPlay?: boolean;
  state?: 'playing' | 'paused';
  videoRef?: RefObject<HTMLVideoElement>;
}) => {
  const media_type = background?.startsWith('color:')
    ? 'color'
    : background?.startsWith('component:')
      ? 'css'
      : contentType(background?.split('/').pop() ?? '') || '';

  return (
    <>
      <motion.div
        initial={{ filter: 'blur(100px)' }}
        animate={{ filter: 'blur(0px)' }}
        transition={{ duration: 1 }}
        className="absolute inset-0 group pointer-events-auto"
      >
        {background && (
          <>
            {(media_type?.startsWith('video/') ||
              media_type === 'application/mp4') && (
              <>
                <div className="absolute inset-0 bg-black/30 pointer-events-auto" />

                <video
                  ref={videoRef}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  preload="metadata"
                  autoPlay={autoPlay}
                  loop
                  muted
                  playsInline
                >
                  <source src={background} type="video/mp4" />
                </video>
              </>
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
              <div
                className={cn(
                  `absolute top-0 left-0 w-full h-full object-cover`,
                  { ' ': autoPlay === false && state === 'paused' }
                )}
              >
                <Suspense fallback={null}>
                  <PreviewBackground name={background} />
                </Suspense>
              </div>
            )}

            {media_type === 'color' && (
              <div
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ backgroundColor: background.replace('color:', '') }}
              />
            )}
          </>
        )}

        {media_type === '' && (
          <div className="absolute inset-0 bg-black/30 pointer-events-auto" />
        )}
      </motion.div>
    </>
  );
};
