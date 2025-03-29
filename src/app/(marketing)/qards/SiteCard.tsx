'use client';

import { Block, Prisma } from '@prisma/client';
import { useActionState, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

import { like } from 'actions/like';
import { BlockList } from 'app/[domain]/client';
import { Button } from 'components/ui/button';
import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Footer } from 'components/website/footer';
import { Main } from 'components/website/main';
import { Wrapper } from 'components/website/wrapper';
import { useIsMobile } from 'hooks/use-mobile';
import useTranslation from 'hooks/use-translation';
import { cn } from 'lib/utils';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import 'array-grouping-polyfill';

export const SiteCard = ({
  site,
  ip
}: {
  ip: string;
  site: Prisma.SiteGetPayload<{
    include: {
      user: true;
      clicks: true;
      likes: true;
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] };
    };
  }>;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [likeState, likeAction, loading] = useActionState(like, {
    liked: site.likes.some(like => like.ip === ip),
    count: site.likes.length
  });

  const [isVisible, setIsVisible] = useState(() => false);
  const [state, setState] = useState<'playing' | 'paused'>('paused');

  const translate = useTranslation();
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  const handleMouseEnter = () => {
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
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile, isVisible]);

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

      <div className="absolute inset-0 flex flex-col gap-4 items-end justify-end p-2">
        <form action={likeAction}>
          <input type="hidden" name="siteId" value={site.id} />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 p-4 text-3xl bg-white rounded-md border border-stone-200 shadow-lg"
          >
            {likeState.liked ? (
              <FaHeart className={cn({ 'animate-wiggle': loading })} />
            ) : (
              <FaRegHeart className={cn({ 'animate-wiggle': loading })} />
            )}

            {likeState.count > 0 && (
              <motion.span
                className="text-xl font-bold"
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {likeState.count}
              </motion.span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
