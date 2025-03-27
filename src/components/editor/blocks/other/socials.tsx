'use client';

import type { Block } from '@prisma/client';
import * as z from 'zod';

import { cn, json } from 'lib/utils';

import { SocialIcon } from 'react-social-icons';
import Link from 'next/link';
import { LuLink } from 'react-icons/lu';
export const input = z.object({
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

export default function Socials({
  block,
  socials = [
    { id: '1', href: 'https://www.instagram.com', logo: 'instagram' },
    { id: '2', href: 'https://www.tiktok.com', logo: 'tiktok' },
    { id: '3', href: 'https://www.youtube.com', logo: 'youtube' },
    { id: '4', href: 'https://www.facebook.com', logo: 'facebook' },
    { id: '5', href: 'https://www.twitter.com', logo: 'twitter' },
    { id: '6', href: 'https://www.linkedin.com', logo: 'linkedin' }
  ]
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  return (
    <div className="flex-1 flex gap-3 items-center justify-center">
      {socials.map(social => (
        <Link
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
    </div>
  );
}
