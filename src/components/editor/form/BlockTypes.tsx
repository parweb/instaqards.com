'use client';

import { AnimatePresence } from 'framer-motion';
import { FaRegFileAlt, FaRegImage } from 'react-icons/fa';
import { IoTextOutline } from 'react-icons/io5';
import { LuShare2 } from 'react-icons/lu';
import { RxButton } from 'react-icons/rx';

import { Accordion } from 'components/ui/accordion';
import { BlockTypesItem } from './BlockTypesItem';

const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
    );

  return `#${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}`;
};

const getRainbowColor = (
  value: number,
  min = 0,
  max = 100
): [string, string, string] => {
  const hue = ((value - min) / (max - min)) * 360;

  return [
    hslToRgb(hue, 100, 90),
    hslToRgb(hue, 100, 80),
    hslToRgb(hue, 100, 30)
  ];
};

export const BlockTypes = ({
  onClick
}: {
  // eslint-disable-next-line no-unused-vars
  onClick: (data: { type: string; id: string }) => void;
}) => {
  return (
    <Accordion type="single" collapsible>
      <div className="flex flex-col gap-3" style={{ touchAction: 'pan-y' }}>
        <AnimatePresence>
          {(
            [
              { type: 'button', label: 'Boutons', icon: RxButton },
              { type: 'picture', label: 'Images', icon: FaRegImage },
              { type: 'text', label: 'Textes', icon: IoTextOutline },
              { type: 'external', label: 'Externes', icon: LuShare2 },
              { type: 'other', label: 'Autres', icon: FaRegFileAlt },
              { type: 'social', label: 'Socials', icon: FaRegFileAlt }
            ] as const
          ).map((block, index, list) => (
            <BlockTypesItem
              key={block.type}
              index={index}
              {...block}
              onClick={onClick}
              Icon={block.icon}
              color={getRainbowColor((index / list.length) * 100)}
            />
          ))}
        </AnimatePresence>
      </div>
    </Accordion>
  );
};
