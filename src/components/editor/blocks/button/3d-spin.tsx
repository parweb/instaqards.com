import type { Block } from '@prisma/client';
import Link from 'next/link';
import * as z from 'zod';

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
    kind: 'string'
  })
);

const BaseButtonProps = z.object({ label: $label });
export const input = z.object({ label: $label, href: $href });

const BaseButton: React.FC<
  Partial<z.infer<typeof BaseButtonProps>> & { className?: string }
> = ({ label, className }) => {
  return (
    <button type="button" className={className}>
      <span>{label}</span>
      <span>{label}</span>
      <span>{label}</span>
      <span>{label}</span>

      <style jsx>{`
        button {
          position: relative;
          width: 100%;
          height: 40px;
          transition: 4s;
          transform-style: preserve-3d;
          transform: perspective(1000px) rotateX(0deg);
        }

        button:hover {
          transform: perspective(1000px) rotateX(360deg);
        }

        button span {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          background: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: 0.5s;
          border: 2px solid #000;
          box-sizing: border-box;
          box-shadow: insert 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        button:hover span {
          color: #fff;
          background: rgba(3, 169, 244, 0.8);
        }

        button span:nth-child(1) {
          transform: rotateX(360deg) translateZ(20px);
        }

        button span:nth-child(2) {
          transform: rotateX(270deg) translateZ(20px);
        }

        button span:nth-child(3) {
          transform: rotateX(180deg) translateZ(20px);
        }

        button span:nth-child(4) {
          transform: rotateX(90deg) translateZ(20px);
        }
      `}</style>
    </button>
  );
};

export default function ThreeDSpin({
  label = '3D Spin',
  href,
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  if (href) {
    return (
      <Link
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
