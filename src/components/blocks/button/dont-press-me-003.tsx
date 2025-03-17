import * as z from 'zod';
import Link from 'next/link';

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
    <button className={cn('button-10', className)} type="button">
      <span className="text">{label}</span>

      <style jsx>{`
        button.button-10 {
          touch-action: manipulation;
          position: relative;
          display: inline-block;
          cursor: pointer;
          outline: none;
          border: 0;
          vertical-align: middle;
          text-decoration: none;
        }
        button.button-10 {
          touch-action: manipulation;
          font-weight: 600;
          color: #382b22;
          text-transform: uppercase;
          padding: 10px 20px;
          background: #fff0f0;
          border: 2px solid #b18597;
          border-radius: 0.75em;
          transform-style: preserve-3d;
          transition:
            transform 150ms cubic-bezier(0, 0, 0.58, 1),
            background 150ms cubic-bezier(0, 0, 0.58, 1);
        }
        button.button-10::before {
          position: absolute;
          content: '';
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #f9c4d2;
          border-radius: inherit;
          box-shadow:
            0 0 0 2px #b18597,
            0 0.625em 0 0 #ffe3e2;
          transform: translate3d(0, 0.75em, -1em);
          transition:
            transform 150ms cubic-bezier(0, 0, 0.58, 1),
            box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
        }
        button.button-10:hover {
          background: #ffe9e9;
          transform: translate(0, 0.25em);
        }
        button.button-10:hover::before {
          box-shadow:
            0 0 0 2px #b18597,
            0 0.5em 0 0 #ffe3e2;
          transform: translate3d(0, 0.5em, -1em);
        }
        button.button-10:active {
          background: #ffe9e9;
          transform: translate(0em, 0.75em);
        }
        button.button-10:active::before {
          box-shadow:
            0 0 0 2px #b18597,
            0 0 #ffe3e2;
          transform: translate3d(0, 0, -1em);
        }
      `}</style>
    </button>
  );
};

export default function DontPressMe003({
  label = 'Press Me',
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
