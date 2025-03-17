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
    <button className={cn('button-55', className)} type="button">
      <span className="text">{label}</span>

      <style jsx>{`
        .button-55 {
          appearance: button;
          background-color: #000;
          background-image: none;
          border: 1px solid #000;
          border-radius: 4px;
          box-shadow:
            #fff 4px 4px 0 0,
            #000 4px 4px 0 1px;
          box-sizing: border-box;
          color: #fff;
          cursor: pointer;
          display: inline-block;
          font-weight: 400;
          line-height: 20px;
          margin: 0 5px 10px 0;
          overflow: visible;
          padding: 10px 20px;
          text-align: center;
          text-transform: none;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: middle;
          white-space: nowrap;
        }

        .button-55:focus {
          text-decoration: none;
        }

        .button-55:hover {
          text-decoration: none;
        }

        .button-55:active {
          box-shadow: rgba(0, 0, 0, 0.125) 0 3px 5px inset;
          outline: 0;
        }

        .button-55:not([disabled]):active {
          box-shadow:
            #fff 2px 2px 0 0,
            #000 2px 2px 0 1px;
          transform: translate(2px, 2px);
        }

        @media (min-width: 768px) {
          .button-55 {
            padding: 12px 50px;
          }
        }
      `}</style>
    </button>
  );
};

export default function DontPressMe004({
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
