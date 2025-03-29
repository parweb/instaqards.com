'use client';

import { Block } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';

import { BlockList } from 'app/[domain]/client';
import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Footer } from 'components/website/footer';
import { Main } from 'components/website/main';
import { Wrapper } from 'components/website/wrapper';
import useTranslation from 'hooks/use-translation';

import 'array-grouping-polyfill';
import { useIsMobile } from 'hooks/use-mobile';

export const SiteCard = ({ site }: { site: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isVisible, setIsVisible] = useState(() => false);
  const [state, setState] = useState<'playing' | 'paused'>('paused');

  const translate = useTranslation();
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  useEffect(() => {
    console.log('QARDS', { isVisible, site: site.subdomain });
  }, [isVisible]);

  const handleMouseEnter = () => {
    console.log('handleMouseEnter', { isMobile, isVisible });

    if (isDesktop && isVisible) {
      setState('playing');

      if (videoRef.current) {
        videoRef.current
          .play()
          .catch(err => console.error('Failed to play video on hover:', err));
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && isVisible) {
      setState('paused');

      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '750px', threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (videoRef.current && isMobile) {
        if (entry.isIntersecting) {
          console.log(
            'QARDS',
            { playing: entry.isIntersecting },
            site.subdomain
          );
          videoRef.current.play();
        } else {
          console.log(
            'QARDS',
            { playing: entry.isIntersecting },
            site.subdomain
          );
          videoRef.current.pause();
        }
      }
    });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile, isVisible]);

  console.log({ isVisible });

  if (!isVisible) {
    return (
      <div
        ref={cardRef}
        className="relative w-full aspect-[9/16] flex bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"
      />
    );
  }

  const data: Record<Block['type'], Block[]> = {
    main: [],
    social: [],
    ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
  };

  console.log({ state });

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
      className="relative w-full aspect-[9/16] flex"
    >
      <Wrapper key={site.id}>
        <Background
          background={site.background}
          autoPlay={false}
          state={state}
          videoRef={videoRef as React.RefObject<HTMLVideoElement>}
        />

        <Content>
          <Main>
            <BlockList blocks={data.main} />
          </Main>

          <Footer>
            <div className="flex gap-3 items-center justify-center">
              <BlockList blocks={data.social} />
            </div>

            <div className="text-center">
              <a
                href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/?r=${site.user?.id}`}
                className="text-white"
                target="_blank"
                rel="noreferrer"
              >
                {translate('page.public.site.ads')}
              </a>
            </div>
          </Footer>
        </Content>
      </Wrapper>
    </div>
  );
};
