import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import { z } from 'zod';

import { json } from 'lib/utils';

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
    kind: 'link'
  })
);

const BaseButtonProps = z.object({ label: $label });
export const input = z.object({ label: $label, href: $href });

const BaseButton: React.FC<
  Partial<z.infer<typeof BaseButtonProps>> & { className?: string }
> = ({ label, className }) => {
  return (
    <button type="button" className={className}>
      <span className="text">{label}</span>

      <style jsx>{`
        button {
          --glow-color: rgb(217, 176, 255);
          --glow-spread-color: rgba(191, 123, 255, 0.781);
          --enhanced-glow-color: rgb(231, 206, 255);
          --btn-color: rgb(100, 61, 136);

          border: 0.25em solid var(--glow-color);
          padding: 10px 20px;
          color: var(--glow-color);
          font-weight: bold;
          background-color: var(--btn-color);
          border-radius: 1em;
          outline: none;
          box-shadow:
            0 0 1em 0.25em var(--glow-color),
            0 0 4em 1em var(--glow-spread-color),
            inset 0 0 0.75em 0.25em var(--glow-color);
          text-shadow: 0 0 0.5em var(--glow-color);
          position: relative;
          transition: all 0.3s;
        }

        // button::after {
        //   pointer-events: none;
        //   content: '';
        //   position: absolute;
        //   top: 120%;
        //   left: 0;
        //   height: 100%;
        //   width: 100%;
        //   background-color: var(--glow-spread-color);
        //   filter: blur(2em);
        //   opacity: 0.7;
        //   transform: perspective(1.5em) rotateX(35deg) scale(1, 0.6);
        // }

        button:hover {
          color: var(--btn-color);
          background-color: var(--glow-color);
          box-shadow:
            0 0 1em 0.25em var(--glow-color),
            0 0 4em 2em var(--glow-spread-color),
            inset 0 0 0.75em 0.25em var(--glow-color);
        }

        button:active {
          box-shadow:
            0 0 0.6em 0.25em var(--glow-color),
            0 0 2.5em 2em var(--glow-spread-color),
            inset 0 0 0.5em 0.25em var(--glow-color);
        }
      `}</style>
    </button>
  );
};

export default function GlowUp002({
  label = 'Glow up',
  href,
  block
}: Partial<z.infer<typeof input>> & {
  block?: Prisma.BlockGetPayload<{ select: { id: true } }>;
}) {
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
