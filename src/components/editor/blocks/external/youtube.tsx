'use client';

import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { LuLoader } from 'react-icons/lu';
import * as z from 'zod';

import type { input as galleryInput } from 'components/editor/blocks/picture/gallery';
import { json } from 'lib/utils';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Video URL', kind: 'string' }))
});

type FeedItem = {
  media: {
    isDefault: false;
    url: string;
    type: string;
    height: number;
    width: number;
  }[];
  id: string;
  title: string;
  link: string;
  pubDate: string;
};

function YoutubeVideo({ url }: z.infer<typeof input>) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = url.split('v=')[1];

  const [playing, setPlaying] = useState(false);

  const activatePlayer = () => {
    setPlaying(true);
  };

  return (
    <div className="relative rounded-md overflow-hidden min-h-72 w-full aspect-video">
      {playing === true && (
        <>
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <FaYoutube className="w-16 h-16 text-red-600" />

            <div className="absolute inset-0 flex items-center justify-center">
              <LuLoader className="w-16 h-16 animate-spin text-white/50" />
            </div>
          </div>

          <iframe
            ref={iframeRef}
            title="YouTube video player"
            width="100%"
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1&showinfo=${playing ? '1' : '0'}&rel=0&iv_load_policy=3`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </>
      )}

      {playing === false && (
        <button
          type="button"
          className="absolute inset-0 h-full aspect-video flex items-center justify-center bg-black transition-opacity hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={activatePlayer}
          aria-label="Activer le son et afficher les contrôles"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Vignette YouTube"
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white w-6 h-6" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <FaYoutube className="text-red-600 w-24 h-24" />
          </div>
        </button>
      )}
    </div>
  );
}

function YoutubeChannel({ url }: z.infer<typeof input>) {
  const [videos, setVideos] = useState<z.infer<typeof galleryInput>['medias']>(
    []
  );
  // https://www.youtube.com/feeds/videos.xml?channel_id=UCLOAPb7ATQUs_nDs9ViLcMw

  const handle = url.includes('/c/')
    ? url.split('/c/').at(-1)
    : url.includes('/@')
      ? url.split('/@').at(-1)
      : url.includes('/channel/')
        ? url.split('/channel/').at(-1)
        : null;

  console.log({ handle });

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const response = await fetch(
          `/api/youtube/channel?handle=${handle}&url=${url}`,
          {
            signal: controller.signal
          }
        );

        const data = await response.json();

        setVideos(
          data.feed
            .filter((item: FeedItem) => item.id.includes('yt:video:'))
            .map((video: FeedItem) => {
              const videoId = video.id.replace('yt:video:', '');

              return {
                id: videoId,
                url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                kind: 'remote'
              };
            })
        );
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Ignore abort errors as they are expected when component unmounts
          return;
        }
        console.error('Error fetching YouTube channel:', error);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [handle, url]);

  if (videos.length === 0) {
    return (
      <div className="w-full aspect-video bg-white rounded-md flex items-center justify-center">
        <FaYoutube className="w-16 h-16 text-red-600" />

        <div className="absolute inset-0 flex items-center justify-center">
          <LuLoader className="w-16 h-16 animate-spin text-white/50" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      <Carousel
        opts={{ dragFree: true }}
        plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
      >
        <CarouselContent>
          {videos.map(video => (
            <CarouselItem key={video.id}>
              <YoutubeVideo
                url={`https://www.youtube.com/watch?v=${video.id}`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default function Youtube({
  url = 'https://www.youtube.com/watch?v=VCyuZhnm71I'
}: Partial<z.infer<typeof input>>) {
  if (url.includes('/c/') || url.includes('/@') || url.includes('/channel/')) {
    return <YoutubeChannel url={url} />;
  }

  return <YoutubeVideo url={url} />;
}
