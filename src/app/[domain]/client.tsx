'use client';

import type { Block } from '@prisma/client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense } from 'react';
import { SocialIcon } from 'react-social-icons';

import { cn, generateCssProperties, type BlockStyle } from 'lib/utils';

const BlockWidget = ({ block }: { block: Block }) => {
  const widget = block.widget as unknown as {
    type: string;
    id: string;
    data: unknown;
  };

  const Component = dynamic(
    () => import(`components/editor/blocks/${widget.type}/${widget.id}.tsx`)
  );

  return <Component {...(widget?.data ?? {})} />;
};

export const BlockItem = (block: Block) => {
  const css = block.style as unknown as BlockStyle;

  if (block.type === 'main') {
    const hasWidget = !(
      Boolean(block?.widget) === false ||
      Object.keys(block?.widget ?? {}).length === 0
    );

    if (hasWidget === false) {
      return (
        <Link href={`/click/${block.id}`} target="_blank" legacyBehavior>
          {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
          <a
            id={block.id}
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
          </a>
        </Link>
      );
    }

    return (
      <Suspense fallback={null}>
        <BlockWidget block={block} />
      </Suspense>
    );
  }

  if (block.type === 'social') {
    return (
      <Link href={`/click/${block.id}`} target="_blank" rel="noreferrer">
        <div>
          {block.logo?.includes('http') ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={cn(
                  block.label === 'facebook' && 'h-[65px]',
                  block.label !== 'facebook' && 'h-[50px]',
                  'object-contain transition-all hover:scale-125'
                )}
                src={block.logo ?? ''}
                alt={block.label ?? ''}
              />
            </>
          ) : (
            <SocialIcon
              className={cn(
                block.label === 'facebook' && 'h-[65px]',
                block.label !== 'facebook' && 'h-[50px]',
                'object-contain transition-all hover:scale-125'
              )}
              url={block.href ?? ''}
            />
          )}
        </div>
      </Link>
    );
  }

  return <></>;
};

export const BlockList = ({ blocks }: { blocks: Block[] }) => {
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
        <BlockItem key={`BlockItem-${props.id}`} {...props} />
      ))}
    </>
  );
};
