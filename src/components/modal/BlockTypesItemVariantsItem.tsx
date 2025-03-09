'use client';

import { cn } from 'lib/utils';

import GlowUp001 from 'components/blocks/button/glow-up-001';
import GlowUp002 from 'components/blocks/button/glow-up-002';
import SlideFromLeft001 from 'components/blocks/button/slide-from-left-001';
import DontPressMe001 from 'components/blocks/button/dont-pressme-001';
import DontPressMe002 from 'components/blocks/button/dont-pressme-002';
import DontPressMe003 from 'components/blocks/button/dont-pressme-003';
import DontPressMe004 from 'components/blocks/button/dont-pressme-004';
import DontPressMe005 from 'components/blocks/button/dont-pressme-005';
import Gold from 'components/blocks/button/gold';
import Shiny from 'components/blocks/button/shiny';
import LogoCircle from 'components/blocks/picture/logo-circle';
import LogoSquare from 'components/blocks/picture/logo-square';
import Picture169 from 'components/blocks/picture/picture-16-9';
import NormalText from 'components/blocks/text/normal';
import Spotify from 'components/blocks/external/spotify';
import Youtube from 'components/blocks/external/youtube';
import Tiktok from 'components/blocks/external/tiktok';
import Instagram from 'components/blocks/external/instagram';

const blocks: Record<
  string,
  Record<string, React.ComponentType<{ label?: string }>>
> = {
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
    instagram: Instagram
  }
};

export const BlockTypesItemVariantsItem = ({
  id,
  label,
  type
}: {
  id: string;
  label: string;
  type: 'button' | 'picture' | 'text' | 'external';
}) => {
  const Component = blocks[type][id];

  return (
    <div
      className={cn(
        'touch-pan-y touch-pinch-zoom flex flex-col justify-between gap-1 aspect-video w-[320px] border border-stone-200 rounded-md p-2'
      )}
    >
      <div className="flex-1 flex items-center justify-center">
        <Component label="Press Me" />
      </div>

      {/* <h4>{label}</h4> */}
    </div>
  );
};
