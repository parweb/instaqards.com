'use client';

import { motion } from 'motion/react';
import { ErrorBoundary } from 'react-error-boundary';

import { Badge } from 'components/ui/badge';
import { BlockTypesItemVariants } from './BlockTypesItemVariants';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from 'components/ui/accordion';

export const BlockTypesItem = ({
  label,
  type,
  description,
  onClick,
  value,
  color = ['#743ad5', '#d53a9d', '#d53a9d', '#d53a9d'],
  Icon,
  index
}: {
  label: string;
  description?: string;
  type: 'button' | 'picture' | 'text' | 'external' | 'other' | 'social';
  // eslint-disable-next-line no-unused-vars
  onClick: (data: { type: string; id: string }) => void;
  value?: { type: string; id: string };
  color?: [string, string, string, string];
  Icon?: React.ElementType;
  index: number;
}) => {
  const variants: {
    id: string;
    label: string;
    type: 'button' | 'picture' | 'text' | 'external' | 'other' | 'social';
  }[] = [
    { id: 'glow-up-001', label: 'Glow up 1', type: 'button' },
    { id: 'glow-up-002', label: 'Glow up 2', type: 'button' },
    { id: 'glow-up-003', label: 'Glow up 3', type: 'button' },
    { id: 'icon', label: 'Image', type: 'button' },
    { id: 'direction', label: 'Direction', type: 'button' },
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
    { id: 'apple-watch', label: 'Apple watch', type: 'picture' },
    { id: 'bento', label: 'Bento', type: 'picture' },

    { id: 'normal', label: 'Normal', type: 'text' },
    { id: 'ghibli', label: 'Ghibli', type: 'text' },
    { id: 'gradiant', label: 'Gradiant', type: 'text' },

    { id: 'instagram', label: 'Instagram', type: 'external' },
    { id: 'snapchat', label: 'Snapchat', type: 'external' },
    { id: 'facebook', label: 'Facebook', type: 'external' },
    { id: 'youtube', label: 'Youtube', type: 'external' },
    { id: 'spotify', label: 'Spotify', type: 'external' },
    { id: 'tiktok', label: 'Tiktok', type: 'external' },
    { id: 'soundcloud', label: 'Soundcloud', type: 'external' },
    { id: 'twitter', label: 'X', type: 'external' },
    { id: 'apple-music', label: 'Apple Music', type: 'external' },
    { id: 'iframe', label: 'Site', type: 'external' },

    { id: 'email', label: 'Email', type: 'other' },
    { id: 'profile', label: 'Profile', type: 'other' },
    { id: 'reservation', label: 'Reservation', type: 'other' },
    { id: 'maps', label: 'Maps', type: 'other' },

    { id: 'simple', label: 'Simple', type: 'social' },
    { id: 'arc', label: 'Arc', type: 'social' }
  ];

  const collection = variants.filter(v => v.type === type);

  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col">
          <hgroup className="flex gap-2 items-center justify-between">
            <label>{label}</label>
            {description && <p>{description}</p>}
          </hgroup>

          <BlockTypesItemVariants
            onClick={onClick}
            value={value}
            variants={variants.filter(v => v.type === type)}
          />
        </div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.15 }
        }}
        exit={{ opacity: 0, y: -10 }}
        className="scale-95 hover:scale-100 transition-all duration-300"
      >
        <AccordionItem
          value={type}
          className="border-2 rounded-md px-0 cursor-pointer shadow-sm"
          style={{ borderColor: color[1] }}
        >
          <div className="flex flex-col gap-0">
            <AccordionTrigger className="p-2" style={{ color: color[2] }}>
              <hgroup className="flex flex-col gap-2 items-start justify-between flex-1 pr-2">
                <div className="flex-1 self-stretch flex gap-2 items-center justify-between flex-1 pr-2">
                  {Icon && <Icon className="w-4 h-4" />}

                  <label
                    className="flex-1 text-left"
                    style={{ color: color[2] }}
                  >
                    {label}
                  </label>

                  <Badge
                    variant="outline"
                    style={{
                      background: `linear-gradient(to bottom, ${color[0]}, ${color[1]})`,
                      color: color[2],
                      borderColor: color[2]
                    }}
                  >
                    {collection.length}
                  </Badge>
                </div>
                {description && (
                  <p
                    className="text-left italic text-sm"
                    style={{ color: color[2] }}
                  >
                    {description}
                  </p>
                )}
              </hgroup>
            </AccordionTrigger>

            <AccordionContent className="p-2">
              <BlockTypesItemVariants
                onClick={onClick}
                value={value}
                variants={collection}
              />
            </AccordionContent>
          </div>
        </AccordionItem>
      </motion.div>
    </ErrorBoundary>
  );
};
