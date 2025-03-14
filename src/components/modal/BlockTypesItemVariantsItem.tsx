'use client';

import { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuExpand, LuPlus } from 'react-icons/lu';

import DontPressMe001 from 'components/blocks/button/dont-press-me-001';
import DontPressMe002 from 'components/blocks/button/dont-press-me-002';
import DontPressMe003 from 'components/blocks/button/dont-press-me-003';
import DontPressMe004 from 'components/blocks/button/dont-press-me-004';
import DontPressMe005 from 'components/blocks/button/dont-press-me-005';
import GlowUp001 from 'components/blocks/button/glow-up-001';
import GlowUp002 from 'components/blocks/button/glow-up-002';
import Gold from 'components/blocks/button/gold';
import Shiny from 'components/blocks/button/shiny';
import SlideFromLeft001 from 'components/blocks/button/slide-from-left-001';
import Facebook from 'components/blocks/external/facebook';
import Instagram from 'components/blocks/external/instagram';
import Soundcloud from 'components/blocks/external/soundcloud';
import Spotify from 'components/blocks/external/spotify';
import Tiktok from 'components/blocks/external/tiktok';
import Twitter from 'components/blocks/external/twitter';
import Youtube from 'components/blocks/external/youtube';
import LogoCircle from 'components/blocks/picture/logo-circle';
import LogoSquare from 'components/blocks/picture/logo-square';
import Picture169 from 'components/blocks/picture/picture-16-9';
import NormalText from 'components/blocks/text/normal';
import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';

const blocks: Record<string, Record<string, React.ComponentType>> = {
  button: {
    'glow-up-001': GlowUp001,
    'glow-up-002': GlowUp002,
    'slide-from-left-001': SlideFromLeft001,
    'dont-press-me-001': DontPressMe001,
    'dont-press-me-002': DontPressMe002,
    'dont-press-me-003': DontPressMe003,
    'dont-press-me-004': DontPressMe004,
    'dont-press-me-005': DontPressMe005,
    gold: Gold,
    shiny: Shiny
  },
  picture: {
    'logo-circle': LogoCircle,
    'logo-square': LogoSquare,
    'picture-16-9': Picture169
  },
  text: {
    normal: NormalText
  },
  external: {
    spotify: Spotify,
    youtube: Youtube,
    tiktok: Tiktok,
    instagram: Instagram,
    facebook: Facebook,
    soundcloud: Soundcloud,
    twitter: Twitter
  }
};

export const BlockTypesItemVariantsItem = ({
  id,
  label,
  type,
  onClick
}: {
  id: string;
  label: string;
  type: 'button' | 'picture' | 'text' | 'external';
  onClick: (data: { type: string; id: string }) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const Component = blocks[type][id];
  Component.displayName = `Block${type}${id}`;

  const Main = memo(() => {
    return (
      <>
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
          <div className={cn('px-1 w-full', { 'px-4': expanded })}>
            {/* @ts-ignore */}
            <Component label="Press Me" />
          </div>

          <div className="absolute inset-0 flex items-start justify-end z-60">
            <Button
              type="button"
              onClick={() => {
                setExpanded(state => !state);
              }}
              size="icon"
              variant="ghost"
              className="cursor-pointer"
            >
              <LuExpand />
            </Button>
          </div>
        </div>

        {expanded === false && (
          <hgroup className="flex items-center justify-between gap-2">
            <h4>{label}</h4>

            <Button
              type="button"
              size="icon"
              className={cn('scale-300')}
              onClick={() => onClick({ type, id })}
            >
              <LuPlus />
            </Button>
          </hgroup>
        )}
      </>
    );
  });

  Main.displayName = `Block${type}${id}`;

  if (expanded === true) {
    return createPortal(
      <div
        className={cn(
          'touch-pan-y touch-pinch-zoom flex flex-col justify-between gap-1 aspect-video w-[320px] border border-stone-200 rounded-md p-2',
          {
            'fixed inset-0 z-50 bg-white w-auto h-auto aspect-auto rounded-none':
              expanded
          }
        )}
      >
        <Main />
      </div>,
      document.body
    );
  }

  return (
    <div className="touch-pan-y touch-pinch-zoom flex flex-col justify-between gap-1 aspect-video w-[320px] border border-stone-200 rounded-md p-2">
      <Main />
    </div>
  );
};
