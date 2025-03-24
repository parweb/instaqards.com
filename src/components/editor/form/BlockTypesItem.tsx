'use client';

import { BlockTypesItemVariants } from './BlockTypesItemVariants';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from 'components/ui/accordion';

export const BlockTypesItem = ({
  label,
  type,
  onClick,
  value
}: {
  label: string;
  type: 'button' | 'picture' | 'text' | 'external' | 'other';
  // eslint-disable-next-line no-unused-vars
  onClick: (data: { type: string; id: string }) => void;
  value?: { type: string; id: string };
}) => {
  const variants: {
    id: string;
    label: string;
    type: 'button' | 'picture' | 'text' | 'external' | 'other';
  }[] = [
    { id: 'glow-up-001', label: 'Glow up 1', type: 'button' },
    { id: 'glow-up-002', label: 'Glow up 2', type: 'button' },
    { id: 'glow-up-003', label: 'Glow up 3', type: 'button' },
    { id: 'icon', label: 'Image', type: 'button' },
    { id: 'slide-from-left-001', label: 'Slide from left', type: 'button' },
    { id: 'dont-press-me-001', label: 'Dont press me', type: 'button' },
    { id: 'dont-press-me-002', label: 'Dont press me 2', type: 'button' },
    { id: 'dont-press-me-003', label: 'Dont press me 3', type: 'button' },
    { id: 'dont-press-me-004', label: 'Dont press me 4', type: 'button' },
    { id: 'dont-press-me-005', label: 'Dont press me 5', type: 'button' },
    { id: 'flip-flap', label: 'Flip flap', type: 'button' },
    { id: '3d-spin', label: '3D spin', type: 'button' },
    { id: 'glassy', label: 'Glassy', type: 'button' },
    { id: 'gold', label: 'Gold', type: 'button' },
    { id: 'shiny', label: 'Shiny', type: 'button' },

    { id: 'logo-circle', label: 'Logo circle', type: 'picture' },
    { id: 'logo-square', label: 'Logo square', type: 'picture' },
    { id: 'picture-16-9', label: 'Picture 16:9', type: 'picture' },
    { id: 'gallery', label: 'Gallery', type: 'picture' },

    { id: 'normal', label: 'Normal', type: 'text' },

    { id: 'spotify', label: 'Spotify', type: 'external' },
    { id: 'youtube', label: 'Youtube', type: 'external' },
    { id: 'tiktok', label: 'Tiktok', type: 'external' },
    { id: 'instagram', label: 'Instagram', type: 'external' },
    { id: 'facebook', label: 'Facebook', type: 'external' },
    { id: 'soundcloud', label: 'Soundcloud', type: 'external' },
    { id: 'twitter', label: 'X', type: 'external' },
    { id: 'apple-music', label: 'Apple Music', type: 'external' },

    { id: 'email', label: 'Email', type: 'other' },
    { id: 'profile', label: 'Profile', type: 'other' },
    { id: 'reservation', label: 'Reservation', type: 'other' }
  ];

  return (
    <AccordionItem value={type}>
      <div className="flex flex-col gap-2">
        <AccordionTrigger>
          <hgroup className="flex gap-2 items-center justify-between">
            <h3>{label}</h3>
          </hgroup>
        </AccordionTrigger>

        <AccordionContent>
          <BlockTypesItemVariants
            onClick={onClick}
            value={value}
            variants={variants.filter(v => v.type === type)}
          />
        </AccordionContent>
      </div>
    </AccordionItem>
  );
};
