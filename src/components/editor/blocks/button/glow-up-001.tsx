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
    <button className={cn('glow-on-hover', className)} type="button">
      {label}

      <style jsx>{`
        .glow-on-hover {
          padding: 10px 20px;
          border: none;
          outline: none;
          color: #fff;
          background: #111;
          cursor: pointer;
          position: relative;
          z-index: 0;
          border-radius: 10px;
        }

        .glow-on-hover:before {
          content: '';
          background: linear-gradient(
            45deg,
            #ff0000,
            #ff7300,
            #fffb00,
            #48ff00,
            #00ffd5,
            #002bff,
            #7a00ff,
            #ff00c8,
            #ff0000
          );
          position: absolute;
          top: -2px;
          left: -2px;
          background-size: 400%;
          z-index: -1;
          filter: blur(5px);
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          animation: glowing 20s linear infinite;
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
          border-radius: 10px;
        }

        .glow-on-hover:active {
          color: #000;
        }

        .glow-on-hover:active:after {
          background: transparent;
        }

        .glow-on-hover:hover:before {
          opacity: 1;
        }

        .glow-on-hover:after {
          z-index: -1;
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: #111;
          left: 0;
          top: 0;
          border-radius: 10px;
        }

        @keyframes glowing {
          0% {
            background-position: 0 0;
          }
          50% {
            background-position: 400% 0;
          }
          100% {
            background-position: 0 0;
          }
        }
      `}</style>
    </button>
  );
};

export default function GlowUp001({
  label = 'Glow up',
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
