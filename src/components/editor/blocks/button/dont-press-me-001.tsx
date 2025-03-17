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
    <button className={cn('button', className)} type="button">
      <span>{label}</span>

      <style jsx>{`
        .button {
          position: relative;
          display: inline-block;
        }

        .button span {
          color: white;
          font-weight: bold;
          font-size: 16px;
          text-align: center;
          text-decoration: none;
          background-color: #ffa12b;
          display: block;
          position: relative;
          padding: 10px 20px;

          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          text-shadow: 0px 1px 0px #000;
          filter: drop-shadow(0px 3px 0px #000);

          -webkit-box-shadow:
            inset 0 1px 0 #ffe5c4,
            0 10px 0 #915100;
          -moz-box-shadow:
            inset 0 1px 0 #ffe5c4,
            0 10px 0 #915100;
          box-shadow: inset 0 1px 0 #ffe5c4;

          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
        }

        .button span:active {
          top: 10px;
          background-color: #f78900;

          -webkit-box-shadow:
            inset 0 1px 0 #ffe5c4,
            inset 0 -3px 0 #915100;
          -moz-box-shadow:
            inset 0 1px 0 #ffe5c4,
            inset 0 -3px 0 #915100;
          box-shadow:
            inset 0 1px 0 #ffe5c4,
            inset 0 -3px 0 #915100;
        }

        .button:after {
          content: '';
          height: 100%;
          width: 100%;

          position: absolute;
          bottom: -15px;
          left: -4px;
          z-index: -1;
          background-color: #2b1800;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
        }
      `}</style>
    </button>
  );
};

export default function DontPressMe001({
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
