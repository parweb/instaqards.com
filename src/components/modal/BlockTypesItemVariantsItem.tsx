'use client';

import { LuPlus } from 'react-icons/lu';

import DontPressMe001 from 'components/blocks/button/dont-pressme-001';
import DontPressMe002 from 'components/blocks/button/dont-pressme-002';
import DontPressMe003 from 'components/blocks/button/dont-pressme-003';
import DontPressMe004 from 'components/blocks/button/dont-pressme-004';
import DontPressMe005 from 'components/blocks/button/dont-pressme-005';
import GlowUp001 from 'components/blocks/button/glow-up-001';
import GlowUp002 from 'components/blocks/button/glow-up-002';
import Gold from 'components/blocks/button/gold';
import Shiny from 'components/blocks/button/shiny';
import SlideFromLeft001 from 'components/blocks/button/slide-from-left-001';
import Facebook from 'components/blocks/external/facebook';
import Instagram from 'components/blocks/external/instagram';
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
    twitter: Twitter,
    facebook: Facebook
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
  const Component = blocks[type][id];

  return (
    <div
      className={cn(
        'touch-pan-y touch-pinch-zoom flex flex-col justify-between gap-1 aspect-video w-[320px] border border-stone-200 rounded-md p-2'
      )}
    >
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* @ts-ignore */}
        <Component label="Press Me" />

        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
          <Button
            type="button"
            size="icon"
            className={cn('scale-300')}
            onClick={() => onClick({ type, id })}
          >
            <LuPlus />
          </Button>
        </div>
      </div>

      <h4>{label}</h4>
    </div>
  );
};
