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
    <button type="button" className={className}>
      {label}

      <style jsx>{`
        button {
          --h: 33;
          --s: 90%;
          --l: 90%;

          user-select: none;

          height: 3em;

          border-radius: 0.5em;
          background-image: linear-gradient(#0003, #0000);

          box-shadow:
            0 -0.125em 0.25em #0002,
            0 0.25em 0.25em hsl(var(--h) var(--s) var(--l) / 0.5),
            0 0 0 0.1em hsl(var(--h) var(--s) var(--l) / 0.5),
            0 0.175em 0.3em hsl(var(--h) var(--s) var(--l) / 0.5) inset,
            0 -0.025em 0.175em hsl(var(--h) var(--s) var(--l) / 0.4) inset,
            0 -0.25em 1em 0.3em hsl(var(--h) var(--s) var(--l) / 0.3) inset,
            0 0.6em 0 hsl(var(--h) var(--s) var(--l) / 0.3) inset,
            0 2em 1em #0004;
          backdrop-filter: blur(0.15em);
          position: relative;
          display: grid;
          place-content: center;
          color: hsl(var(--h) var(--s) var(--l) / 0.7);
          text-shadow:
            0.03em 0.03em #fff5,
            -0.03em -0.03em #0005;
          cursor: pointer;
          transition: 0.1s ease;
          padding-top: 0.2em;
        }

        button:before {
          content: '';
          position: absolute;
          top: 100%;
          width: 80%;
          left: 10%;
          height: 1.5em;

          background-image: radial-gradient(
            100% 100% at center,
            hsla(var(--h), var(--s), 80%, 0.25),
            hsla(var(--h), var(--s), 80%, 0) 50%
          );
        }

        button:after {
          content: '';
          inset: 0;
          top: 0.5em;
          position: absolute;

          background-image: linear-gradient(
            105deg,
            transparent 20%,
            hsl(var(--h) var(--s) var(--l) / 0.2) 20%,
            hsl(var(--h) var(--s) var(--l) / 0.2) 30%,
            transparent 30%,
            transparent 32%,
            hsl(var(--h) var(--s) var(--l) / 0.2) 5%,
            hsl(var(--h) var(--s) var(--l) / 0.2) 40%,
            transparent 0%
          );
          background-size: 400% 100%;
          background-position: 100% 0%;
          transition: 0.3s ease;
        }

        button:active:after {
          background-position: -50% 0%;
        }

        button:active {
          translate: 0.01em 0.25em;
          box-shadow:
            0 -0.125em 0.25em #0002,
            0 0.25em 0.25em hsl(var(--h) var(--s) var(--l) / 0.5),
            0 0 0 0.1em hsl(var(--h) var(--s) var(--l) / 0.5),
            0 0.175em 0.3em hsl(var(--h) var(--s) var(--l) / 0.8) inset,
            0 -0.025em 0.175em hsl(var(--h) var(--s) var(--l) / 0.4) inset,
            0 -0.25em 1em 0.3em hsl(var(--h) var(--s) var(--l) / 0.3) inset,
            0 0.6em 0 hsl(var(--h) var(--s) var(--l) / 0.3) inset,
            0 1em 0.5em #0004;
          backdrop-filter: blur(0.08em);
        }

        button:active:before {
          height: 1em;
        }
      `}</style>
    </button>
  );
};

export default function Glassy({
  label = 'Glassy',
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
