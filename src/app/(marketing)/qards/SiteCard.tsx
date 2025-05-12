'use client';

import { Block, Prisma } from '@prisma/client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { LuExternalLink } from 'react-icons/lu';

import {
  memo,
  Suspense,
  unstable_Activity as Activity,
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react';

import { like } from 'actions/like';
import { BlockList } from 'app/[domain]/client';
import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Footer } from 'components/website/footer';
import { Main } from 'components/website/main';
import { Wrapper } from 'components/website/wrapper';
import { useIsMobile } from 'hooks/use-mobile';
import { cn } from 'lib/utils';
import { uri } from 'settings';

import 'array-grouping-polyfill';

const SiteCardComponent = ({
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
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '750px', threshold: 0.1 }
    );

    const currentCardRef = cardRef.current;
    if (currentCardRef) {
      observer.observe(currentCardRef);
    }

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      if (isMobile) {
        video.play().catch(err => console.error('Failed to play video:', err));
      } else {
        if (state === 'playing') {
          video
            .play()
            .catch(err => console.error('Failed to play video:', err));
        } else {
          video.pause();
        }
      }
    } else {
      video.pause();
    }
  }, [isVisible, isMobile, state]);

  const data: Record<Block['type'], Block[]> = {
    main: [],
    social: [],
    ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[9/16] flex sm:rounded-lg overflow-hidden"
    >
      <Activity mode={isVisible ? 'visible' : 'hidden'}>
        <>
          <Wrapper key={site.id}>
            <Suspense fallback={null}>
              <Background
                background={site.background}
                autoPlay={false}
                state={state}
                videoRef={videoRef as React.RefObject<HTMLVideoElement>}
              />
            </Suspense>

            <Content>
              <Main length={data.main.length}>
                <Suspense fallback={null}>
                  <BlockList blocks={data.main} />
                </Suspense>
              </Main>

              <Footer>
                <div className="flex gap-3 items-center justify-center">
                  <Suspense fallback={null}>
                    <BlockList blocks={data.social} />
                  </Suspense>
                </div>
              </Footer>
            </Content>
          </Wrapper>

          <div className="absolute inset-0 flex gap-4 items-end justify-end p-2 pointer-events-none">
            <div className="pointer-events-auto">
              <Link
                href={
                  uri.site(site).link +
                  '?utm_source=qards.link&utm_medium=marketing&utm_campaign=lookmeup'
                }
                target="_blank"
                className="flex items-center justify-center gap-2 p-4 text-3xl bg-white rounded-md border border-stone-200 shadow-lg"
              >
                <LuExternalLink className="" />

                <span className="text-xl font-bold">Share</span>
              </Link>
            </div>

            <form action={likeAction} className="pointer-events-auto">
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
        </>
      </Activity>

      {!isVisible && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  );
};

export const SiteCard = memo(SiteCardComponent);
