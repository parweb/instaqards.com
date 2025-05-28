'use client';

import type { Site } from '@prisma/client';
import { motion } from 'motion/react';
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
      : contentType(
          String(background)?.split('|').at(0)?.split('/').pop() ?? ''
        ) || '';

  return (
    <>
      <motion.div
        initial={{ filter: 'blur(100px)' }}
        animate={{ filter: 'blur(0px)' }}
        transition={{ duration: 1 }}
        className="group pointer-events-auto absolute inset-0"
      >
        {background && (
          <>
            {(media_type?.startsWith('video/') ||
              media_type === 'application/mp4') && (
              <>
                <div className="pointer-events-auto absolute inset-0 bg-black/30" />

                <video
                  ref={videoRef}
                  className="absolute top-0 left-0 h-full w-full object-cover"
                  preload="metadata"
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
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
              <div className="absolute top-0 left-0 h-full w-full object-cover">
                <div className="plop" />
                {background.includes('|') ? (
                  <div
                    className="yolo absolute inset-0"
                    style={{
                      opacity: 0.75,
                      backgroundImage: `url(${background.split('|').at(0)})`,
                      backgroundSize: `${background.split('|').at(1)}px`
                    }}
                  />
                ) : (
                  <Image
                    src={background}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            )}

            {media_type === 'css' && (
              <div
                className={cn(
                  `absolute top-0 left-0 h-full w-full object-cover`,
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
                className="absolute top-0 left-0 h-full w-full object-cover"
                style={{ backgroundColor: background.replace('color:', '') }}
              />
            )}
          </>
        )}

        {media_type === '' && (
          <div className="pointer-events-auto absolute inset-0 bg-black/30" />
        )}
      </motion.div>
    </>
  );
};
