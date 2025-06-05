'use client';

import type { Prisma } from '@prisma/client';
import { AnimatePresence, motion } from 'motion/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { memo, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LuLink } from 'react-icons/lu';
import { SocialIcon } from 'react-social-icons';

import { cn, generateCssProperties, type BlockStyle } from 'lib/utils';

const BlockWidget = dynamic(() => import('components/BlockWidget'), {
  ssr: false
});

export const BlockItemComponent = (
  block: Prisma.BlockGetPayload<{
    select: {
      id: true;
      type: true;
      label: true;
      href: true;
      logo: true;
      style: true;
      widget: true;
    };
  }>
) => {
  const css = block.style as unknown as BlockStyle;

  if (block.type === 'main') {
    const hasWidget = !(
      Boolean(block?.widget) === false ||
      Object.keys(block?.widget ?? {}).length === 0
    );

    if (hasWidget === false) {
      return (
        <Link
          prefetch={false}
          id={block.id}
          href={`/click/${block.id}`}
          target="_blank"
          className={cn(
            'transition-all',
            'w-full rounded-md border border-white/90 p-3 text-center text-white/90',
            'hover:bg-white hover:text-black'
          )}
        >
          {block.label}

          <style jsx>{`
            #${block.id} {
              transition: all 0.3s ease;

              ${generateCssProperties(css.normal)}

              ${Object.keys(css || {})
                .filter(key => key !== 'normal')
                .map(
                  key => `
                    &:${key} {
                      ${generateCssProperties(css[key as keyof BlockStyle])}
                    }
                  `
                )}
            }
          `}</style>
        </Link>
      );
    }

    return (
      <ErrorBoundary
        fallbackRender={({ error }) => (
          console.error(error), (<div>Something went wrong, sorry!</div>)
        )}
      >
        <Suspense fallback={null}>
          <BlockWidget block={block} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (block.type === 'social') {
    return (
      <Link
        prefetch={false}
        href={`/click/${block.id}`}
        target="_blank"
        rel="noreferrer"
      >
        <div className="transition-all hover:scale-125">
          {block.logo?.includes('http') ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={cn(
                  block.label === 'facebook' && 'h-[65px]',
                  block.label !== 'facebook' && 'h-[50px]',
                  'object-contain'
                )}
                src={block.logo ?? ''}
                alt={block.label ?? ''}
              />
            </>
          ) : Boolean(block.logo) === true ? (
            <SocialIcon
              as="div"
              network={block.logo ?? undefined}
              className={cn(
                block.label === 'facebook' && 'h-[65px]',
                block.label !== 'facebook' && 'h-[50px]',
                'object-contain'
              )}
              url={block.href ?? ''}
            />
          ) : (
            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-stone-200 p-1">
              <LuLink />
            </div>
          )}
        </div>
      </Link>
    );
  }

  return <></>;
};

export const BlockItem = memo(BlockItemComponent);

const BlockListComponent = ({
  blocks
}: {
  blocks: Prisma.BlockGetPayload<{
    select: {
      id: true;
      type: true;
      label: true;
      href: true;
      logo: true;
      style: true;
      widget: true;
    };
  }>[];
}) => {
  const fontsNeeded = blocks
    .flatMap(({ style }) =>
      Object.values(style as Record<string, { fontFamily: string }>).flatMap(
        css => css.fontFamily
      )
    )
    .filter(Boolean) as string[];

  return (
    <AnimatePresence>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?${fontsNeeded
          .map(font => `family=${font.replaceAll(' ', '+')}&display=swap`)
          .join('&')}&display=swap');
      `}</style>

      {blocks.map(props => (
        <Suspense key={`BlockItem-${props.id}`} fallback={null}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col gap-10 self-stretch"
          >
            <BlockItem {...props} />
          </motion.div>
        </Suspense>
      ))}
    </AnimatePresence>
  );
};

export const BlockList = memo(BlockListComponent);
