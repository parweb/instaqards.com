'use client';

import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { LuLoader } from 'react-icons/lu';
import { z } from 'zod';

import type { input as galleryInput } from 'components/editor/blocks/picture/gallery';
import { trySafe } from 'helpers/trySafe';
import { json } from 'lib/utils';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';

export const input = z.object({
  url: z
    .string()
    .regex(
      /v=[\w-]+(?:&\S*)?|\/(?:c\/[\w.-]+|@[\w.-]+|channel\/[\w-]+)\/?(?:\?\S*)?$/,
      {
        message:
          "L\'URL doit être une vidéo YouTube valide (contenant v=VIDEO_ID) ou une chaîne YouTube valide (ex: /c/NOM, /@HANDLE, /channel/ID)."
      }
    )
    .describe(json({ label: 'Video URL', kind: 'link', just: 'url' }))
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

function YoutubeVideo({
  url,
  title
}: z.infer<typeof input> & { title?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [titleFetched, setTitleFetched] = useState<string | null>(null);
  const videoId = new URL(url).searchParams.get('v');
  const [playing, setPlaying] = useState(false);

  const activatePlayer = () => {
    setPlaying(true);
  };

  useEffect(() => {
    if (!!title) return;

    const controller = new AbortController();

    (async () => {
      const response = await fetch(
        `https://www.youtube.com/oembed?format=json&url=${url}`,
        { signal: controller.signal }
      );

      const data = await response.json();

      setTitleFetched(data.title);
    })();

    return () => controller.abort();
  }, [title, url]);

  return (
    <div className="relative aspect-video min-h-40 w-full overflow-hidden rounded-md">
      {playing === true && (
        <>
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <FaYoutube className="h-16 w-16 text-red-600" />

            <div className="absolute inset-0 flex items-center justify-center">
              <LuLoader className="h-16 w-16 animate-spin text-white/50" />
            </div>
          </div>

          <iframe
            ref={iframeRef}
            title="YouTube video player"
            width="100%"
            className="absolute inset-0 h-full w-full"
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
          className="hover:bg-opacity-10 absolute inset-0 flex aspect-video h-full items-center justify-center bg-black transition-opacity focus:ring-2 focus:ring-red-500 focus:outline-hidden"
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
            <div className="h-6 w-6 bg-white" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <FaYoutube className="h-24 w-24 text-red-600" />
          </div>

          {(title || titleFetched) && (
            <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/50 to-transparent p-2">
              <p className="text-md text-left font-bold text-balance text-white">
                {title || titleFetched}
              </p>
            </div>
          )}
        </button>
      )}
    </div>
  );
}

function YoutubeChannel({ url }: z.infer<typeof input>) {
  const [videos, setVideos] = useState<
    (z.infer<typeof galleryInput>['medias'][number] & { title: string })[]
  >([]);

  const handle = url.includes('/c/')
    ? url.split('/c/').at(-1)
    : url.includes('/@')
      ? url.split('/@').at(-1)
      : url.includes('/channel/')
        ? url.split('/channel/').at(-1)
        : null;

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const response = await fetch(
          `/api/youtube/channel?handle=${handle}&url=${url}`,
          { signal: controller.signal }
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
                kind: 'remote',
                title: video.title
              };
            })
        );
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Error fetching YouTube channel:', error);
      }
    })();

    return () => controller.abort();
  }, [handle, url]);

  if (videos.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-md bg-white">
        <FaYoutube className="h-16 w-16 text-red-600" />

        <div className="absolute inset-0 flex items-center justify-center">
          <LuLoader className="h-16 w-16 animate-spin text-white/50" />
        </div>
      </div>
    );
  }

  if (videos.length === 1) {
    return (
      <YoutubeVideo
        url={`https://www.youtube.com/watch?v=${videos[0].id}`}
        title={videos[0].title}
      />
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
                title={video.title}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

const placeholder = 'https://www.youtube.com/watch?v=VCyuZhnm71I';

export default function Youtube({
  url = placeholder
}: Partial<z.infer<typeof input>>) {
  [, url] = trySafe(() => {
    new URL(url);
    return url;
  }, placeholder);

  if (url.includes('/c/') || url.includes('/@') || url.includes('/channel/')) {
    return <YoutubeChannel url={url} />;
  }

  return <YoutubeVideo url={url} />;
}
