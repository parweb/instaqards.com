import type { Block } from '@prisma/client';
import Link from 'next/link';
import * as z from 'zod';

import { cn, json } from 'lib/utils';

const $label = z
  .string()
  .min(1, 'Label is required')
  .describe(
    json({
      label: 'Label',
      kind: 'string'
    })
  );

const $href = z.string().describe(
  json({
    label: 'Link',
    kind: 'string'
  })
);

const BaseButtonProps = z.object({ label: $label });
export const input = z.object({ label: $label, href: $href });

const BaseButton: React.FC<
  Partial<z.infer<typeof BaseButtonProps>> & { className?: string }
> = ({ label, className }) => {
  return (
    <button className={cn('slide-from-left', className)} type="button">
      {label}

      <style jsx>{`
        .slide-from-left {
          display: inline-block;
          padding: 0.75rem 1.25rem;
          border-radius: 10rem;
          color: #fff;
          text-transform: uppercase;
          font-size: 1rem;
          letter-spacing: 0.15rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .slide-from-left:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #0cf;
          border-radius: 10rem;
          z-index: -2;
        }
        .slide-from-left:before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 100%;
          background-color: #008fb3;
          transition: all 0.3s;
          border-radius: 10rem;
          z-index: -1;
        }
        .slide-from-left:hover {
          color: #fff;
        }
        .slide-from-left:hover:before {
          width: 100%;
        }
      `}</style>
    </button>
  );
};

export default function SlideFromLeft001({
  label = 'Hello',
  href,
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  if (href) {
    return (
      <Link
        prefetch={false}
        className="w-full"
        href={block ? `/click/${block.id}` : href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <BaseButton className="w-full" label={label} />
      </Link>
    );
  }

  return <BaseButton className="w-full" label={label} />;
}
