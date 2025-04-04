'use client';

import type { Block } from '@prisma/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { LuLink } from 'react-icons/lu';
import { SocialIcon } from 'react-social-icons';
import * as z from 'zod';

import Arcange from 'components/arcange';
import { cn, json } from 'lib/utils';

export const input = z.object({
  radius: z.number().describe(
    json({
      label: 'Radius',
      kind: 'number',
      defaultValue: 150
    })
  ),
  distribution: z.number().describe(
    json({
      label: 'Distribution',
      kind: 'number',
      defaultValue: 80
    })
  ),
  socials: z
    .array(
      z.object({
        id: z.string(),
        logo: z.string().optional(),
        href: z.string()
      })
    )
    .describe(
      json({
        label: 'Socials',
        kind: 'socials'
      })
    )
});

export default function Arc({
  block,
  distribution = 80,
  radius = 150,
  socials = [
    { id: '1', href: 'https://www.instagram.com', logo: 'instagram' },
    { id: '2', href: 'https://www.tiktok.com', logo: 'tiktok' },
    { id: '3', href: 'https://www.youtube.com', logo: 'youtube' },
    { id: '4', href: 'https://www.facebook.com', logo: 'facebook' }
  ]
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  const centerPointDegrees = 270;

  const calculatedStartAngle = useMemo(() => {
    return centerPointDegrees - distribution / 2;
  }, [centerPointDegrees, distribution]);

  const calculatedArcAngle = distribution;

  return (
    <div className="flex-1 flex gap-3 items-center justify-center">
      <Arcange
        radius={radius}
        startAngle={calculatedStartAngle} // Use the calculated starting point
        arcAngle={calculatedArcAngle}
        staggerDelay={0.1}
      >
        {socials.map(social => (
          <Link
            prefetch={false}
            key={social.href}
            href={`/click/${block?.id}/?id=${social.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className="transition-all hover:scale-125">
              {social.logo?.includes('http') ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={cn(
                      social.logo === 'facebook' && 'h-[65px]',
                      social.logo !== 'facebook' && 'h-[50px]',
                      'object-contain'
                    )}
                    src={social.logo ?? ''}
                    alt={social.logo ?? ''}
                  />
                </>
              ) : Boolean(social.logo) === true ? (
                <SocialIcon
                  as="div"
                  network={social.logo ?? undefined}
                  className={cn(
                    social.logo === 'facebook' && 'h-[65px]',
                    social.logo !== 'facebook' && 'h-[50px]',
                    'object-contain'
                  )}
                  url={social.href ?? ''}
                />
              ) : (
                <div className="p-1 w-[50px] h-[50px] flex items-center justify-center bg-stone-200 rounded-full">
                  <LuLink />
                </div>
              )}
            </div>
          </Link>
        ))}
      </Arcange>
    </div>
  );
}
