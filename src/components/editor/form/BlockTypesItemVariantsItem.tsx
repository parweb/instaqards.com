'use client';

import { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuPlus } from 'react-icons/lu';

import FlipFlap from 'components/editor/blocks//button/flip-flap';
import ThreeDSpin from 'components/editor/blocks/button/3d-spin';
import Direction from 'components/editor/blocks/button/direction';
import DontPressMe001 from 'components/editor/blocks/button/dont-press-me-001';
import DontPressMe002 from 'components/editor/blocks/button/dont-press-me-002';
import DontPressMe003 from 'components/editor/blocks/button/dont-press-me-003';
import DontPressMe004 from 'components/editor/blocks/button/dont-press-me-004';
import DontPressMe005 from 'components/editor/blocks/button/dont-press-me-005';
import Glassy from 'components/editor/blocks/button/glassy';
import GlowUp001 from 'components/editor/blocks/button/glow-up-001';
import GlowUp002 from 'components/editor/blocks/button/glow-up-002';
import GlowUp003 from 'components/editor/blocks/button/glow-up-003';
import Gold from 'components/editor/blocks/button/gold';
import Icon from 'components/editor/blocks/button/icon';
import Shiny from 'components/editor/blocks/button/shiny';
import SlideFromLeft001 from 'components/editor/blocks/button/slide-from-left-001';
import AppleMusic from 'components/editor/blocks/external/apple-music';
import Facebook from 'components/editor/blocks/external/facebook';
import Iframe from 'components/editor/blocks/external/iframe';
import Instagram from 'components/editor/blocks/external/instagram';
import Snapchat from 'components/editor/blocks/external/snapchat';
import Soundcloud from 'components/editor/blocks/external/soundcloud';
import Spotify from 'components/editor/blocks/external/spotify';
import Tiktok from 'components/editor/blocks/external/tiktok';
import Twitter from 'components/editor/blocks/external/twitter';
import Youtube from 'components/editor/blocks/external/youtube';
import Email from 'components/editor/blocks/other/email';
import Maps from 'components/editor/blocks/other/maps';
import Profile from 'components/editor/blocks/other/profile';
import Reservation from 'components/editor/blocks/other/reservation';
import Store from 'components/editor/blocks/other/store';
import AppleWatch from 'components/editor/blocks/picture/apple-watch';
import Bento from 'components/editor/blocks/picture/bento';
import Gallery from 'components/editor/blocks/picture/gallery';
import LogoCircle from 'components/editor/blocks/picture/logo-circle';
import LogoSquare from 'components/editor/blocks/picture/logo-square';
import Picture169 from 'components/editor/blocks/picture/picture-16-9';
import Arc from 'components/editor/blocks/social/arc';
import Simple from 'components/editor/blocks/social/simple';
import Ghibli from 'components/editor/blocks/text/ghibli';
import Gradiant from 'components/editor/blocks/text/gradiant';
import Normal from 'components/editor/blocks/text/normal';
import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';

const blocks: Record<string, Record<string, React.ComponentType>> = {
  button: {
    'glow-up-001': GlowUp001,
    'glow-up-002': GlowUp002,
    'glow-up-003': GlowUp003,
    icon: Icon,
    direction: Direction,
    'slide-from-left-001': SlideFromLeft001,
    'dont-press-me-001': DontPressMe001,
    'dont-press-me-002': DontPressMe002,
    'dont-press-me-003': DontPressMe003,
    'dont-press-me-004': DontPressMe004,
    'dont-press-me-005': DontPressMe005,
    'flip-flap': FlipFlap,
    '3d-spin': ThreeDSpin,
    glassy: Glassy,
    gold: Gold,
    shiny: Shiny
  },
  picture: {
    'logo-circle': LogoCircle,
    'logo-square': LogoSquare,
    'picture-16-9': Picture169,
    gallery: Gallery,
    'apple-watch': AppleWatch,
    bento: Bento
  },
  text: {
    normal: Normal,
    ghibli: Ghibli,
    gradiant: Gradiant
  },
  external: {
    spotify: Spotify,
    youtube: Youtube,
    tiktok: Tiktok,
    instagram: Instagram,
    facebook: Facebook,
    soundcloud: Soundcloud,
    twitter: Twitter,
    'apple-music': AppleMusic,
    snapchat: Snapchat,
    iframe: Iframe
  },
  other: {
    email: Email,
    profile: Profile,
    reservation: Reservation,
    maps: Maps,
    store: Store
  },
  social: {
    simple: Simple,
    arc: Arc
  }
};

export const BlockTypesItemVariantsItem = ({
  id,
  label,
  type,
  onClick,
  value
}: {
  id: string;
  label: string;
  type: 'button' | 'picture' | 'text' | 'external' | 'other' | 'social';
  // eslint-disable-next-line no-unused-vars
  onClick: (data: { type: string; id: string }) => void;
  value?: { type: string; id: string };
}) => {
  const [expanded] = useState(false);

  const Component = blocks[type][id];
  Component.displayName = `Block${type}${id}`;

  const Main = memo(() => {
    return (
      <>
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden p-2"
          onClick={() => onClick({ type, id })}
          onKeyDown={() => onClick({ type, id })}
        >
          <div className={cn('w-full px-1', { 'px-4': expanded })}>
            {/* @ts-ignore */}
            <Component label="Press Me" />
          </div>

          <div className="absolute inset-0 flex cursor-pointer items-start justify-end" />
        </div>

        {expanded === false && (
          <hgroup className="flex items-center justify-between gap-2">
            <h4
              onClick={() => onClick({ type, id })}
              onKeyDown={() => onClick({ type, id })}
            >
              {label}
            </h4>

            <Button
              type="button"
              size="icon"
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
          'z-20 flex aspect-video w-[320px] touch-pan-y touch-pinch-zoom flex-col justify-between gap-1 rounded-md border border-stone-200 p-2',
          {
            'fixed inset-0 aspect-auto h-auto w-auto rounded-none bg-white':
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
    <div
      className={cn(
        'flex aspect-video w-[320px] touch-pan-y touch-pinch-zoom flex-col justify-between gap-1',
        'rounded-md border border-stone-200 p-2',
        {
          'border-primary border-2': value?.id === id && value?.type === type
        }
      )}
    >
      <Main />
    </div>
  );
};
