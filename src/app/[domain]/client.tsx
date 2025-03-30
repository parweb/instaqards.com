'use client';

import type { Block } from '@prisma/client';
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

export const BlockItemComponent = (block: Block) => {
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
            'border border-white/90 rounded-md p-3 text-white/90 w-full text-center',
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
            <div className="p-1 w-[50px] h-[50px] flex items-center justify-center bg-stone-200 rounded-full">
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

const BlockListComponent = ({ blocks }: { blocks: Block[] }) => {
  const fontsNeeded = blocks
    .flatMap(({ style }) =>
      Object.values(style as Record<string, { fontFamily: string }>).flatMap(
        css => css.fontFamily
      )
    )
    .filter(Boolean) as string[];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?${fontsNeeded
          .map(font => `family=${font.replaceAll(' ', '+')}&display=swap`)
          .join('&')}&display=swap');
      `}</style>

      {blocks.map(props => (
        <Suspense key={`BlockItem-${props.id}`} fallback={null}>
          <BlockItem {...props} />
        </Suspense>
      ))}
    </>
  );
};

export const BlockList = memo(BlockListComponent);
