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

const $href = z
  .string()
  .min(1, 'Link is required')
  .describe(
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
    <button
      type="button"
      className={className}
      data-back={label}
      data-front={label}
    >
      <style jsx>{`
        button {
          opacity: 1;
          outline: 0;
          color: #fff;

          position: relative;
          text-align: center;
          letter-spacing: 1px;
          display: inline-block;
          text-decoration: none;
          text-transform: uppercase;
        }

        button:hover:after {
          opacity: 1;
          transform: translateY(0) rotateX(0);
        }

        button:hover:before {
          opacity: 0;
          transform: translateY(50%) rotateX(90deg);
        }

        button:after {
          top: 0;
          left: 0;
          opacity: 0;
          width: 100%;
          color: #323237;
          display: block;
          padding: 8px 16px;
          transition: 0.5s;
          position: absolute;
          background: #979797;
          content: attr(data-back);
          transform: translateY(-50%) rotateX(90deg);
        }

        button:before {
          top: 0;
          left: 0;
          opacity: 1;
          color: #adadaf;
          display: block;
          padding: 10px 20px;
          transition: 0.5s;
          position: relative;
          background: #323237;
          content: attr(data-front);
          transform: translateY(0) rotateX(0);
        }
      `}</style>
    </button>
  );
};

export default function FlipFlap({
  label = 'Flip flap',
  href
}: Partial<z.infer<typeof input>>) {
  if (href) {
    return (
      <Link
        className="w-full"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <BaseButton className="w-full" label={label} />
      </Link>
    );
  }

  return <BaseButton className="w-full" label={label} />;
}
