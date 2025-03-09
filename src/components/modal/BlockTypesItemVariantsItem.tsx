'use client';

import { cn } from 'lib/utils';

import GlowUp from 'components/blocks/button/glow-up';
import SlideFromLeft001 from 'components/blocks/button/slide-from-left-001';
import DontPressMe001 from 'components/blocks/button/dont-pressme-001';
import DontPressMe002 from 'components/blocks/button/dont-pressme-002';
import DontPressMe003 from 'components/blocks/button/dont-pressme-003';
import Gold from 'components/blocks/button/gold';

const blocks: Record<string, Record<string, React.ComponentType>> = {
  button: {
    'glow-up': GlowUp,
    'slide-from-left-001': SlideFromLeft001,
    'dont-press-me-001': DontPressMe001,
    'dont-press-me-002': DontPressMe002,
    'dont-press-me-003': DontPressMe003,
    gold: Gold
  }
};

export const BlockTypesItemVariantsItem = ({
  id,
  label,
  type
}: {
  id: string;
  label: string;
  type: 'button';
}) => {
  const Component = blocks[type][id];

  return (
    <div
      className={cn(
        'touch-pan-y touch-pinch-zoom flex flex-col justify-between gap-1 aspect-video w-[200px] border border-stone-200 rounded-md p-2'
      )}
    >
      <div className="flex-1 flex items-center justify-center">
        <Component />
      </div>

      {/* <h4>{label}</h4> */}
    </div>
  );
};
