'use client';

import { LuDownload } from 'react-icons/lu';

import { Button } from 'components/ui/button';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

export const DownloadButton = ({ src }: { src: string }) => {
  return (
    <Button
      onClick={() => {
        const a = document.createElement('a');
        a.href = src;
        a.download = src;
        a.click();
      }}
      size="icon"
    >
      <LuDownload />
    </Button>
  );
};

const Download = ({
  src,
  children
}: {
  src: string;
  children: React.ReactNode;
}) => {
  return (
    <Button
      onClick={() => {
        const a = document.createElement('a');
        a.href = src;
        a.download = src;
        a.click();
      }}
    >
      {children}
    </Button>
  );
};

export const GalleryAdsVideo = () => {
  return (
    <Carousel
      opts={{ dragFree: true }}
      plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
    >
      <CarouselContent>
        {[
          {
            id: '001-12s-process',
            gif: '001-12s-process.gif',
            video: '001-12s-process.mp4'
          },
          {
            id: '002-3s-imagine',
            gif: '002-3s-imagine.gif',
            video: '002-3s-imagine.mp4'
          },
          {
            id: '003-43s-features',
            gif: '003-43s-features.gif',
            video: '003-43s-features.mp4'
          }
        ].map(media => (
          <CarouselItem key={media.id}>
            <div className="flex flex-col gap-4">
              <video
                controls
                preload="metadata"
                className="aspect-video h-[400px]"
              >
                <source src={`/api/file?id=${media.video}`} type="video/mp4" />
              </video>

              <div className="flex gap-2">
                <Download src={`/api/file?download&id=${media.video}`}>
                  {media.video.split('.').pop()?.toUpperCase()}
                </Download>
                <Download src={`/api/file?id=${media.gif}`}>GIF</Download>
                <Button disabled variant="outline">
                  {media.id.replaceAll('-', ' ')}
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
