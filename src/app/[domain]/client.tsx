'use client';

import type { Link as PrismaLink } from '@prisma/client';
import Link from 'next/link';
import { SocialIcon } from 'react-social-icons';

import { cn, generateCssProperties, type BlockStyle } from 'lib/utils';

export const LinkItem = (link: PrismaLink) => {
  const css = link.style as unknown as BlockStyle;

  if (link.type === 'main') {
    return (
      <Link href={`/click/${link.id}`} target="_blank" legacyBehavior>
        {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
        <a
          id={link.id}
          className={cn(
            'transition-all',
            'border border-white/90 rounded-md p-3 text-white/90 w-full text-center',
            'hover:bg-white hover:text-black'
          )}
        >
          {link.label}
          <style jsx>{`
            #${link.id} {
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

  if (link.type === 'social') {
    return (
      <Link href={`/click/${link.id}`} target="_blank" rel="noreferrer">
        <div>
          {link.logo?.includes('http') ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={cn(
                  link.label === 'facebook' && 'h-[65px]',
                  link.label !== 'facebook' && 'h-[50px]',
                  'object-contain transition-all hover:scale-125'
                )}
                src={link.logo ?? ''}
                alt={link.label}
              />
            </>
          ) : (
            <SocialIcon
              className={cn(
                link.label === 'facebook' && 'h-[65px]',
                link.label !== 'facebook' && 'h-[50px]',
                'object-contain transition-all hover:scale-125'
              )}
              url={link.href ?? ''}
            />
          )}
        </div>
      </Link>
    );
  }

  return <></>;
};

export const LinkList = ({ links }: { links: PrismaLink[] }) => {
  const fontsNeeded = links
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

      {links.map(props => (
        <LinkItem key={`LinkItem-${props.id}`} {...props} />
      ))}
    </>
  );
};
