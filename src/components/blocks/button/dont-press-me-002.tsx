import * as z from 'zod';
import Link from 'next/link';
import { cn } from 'lib/utils';

const $label = z.string().optional().describe('Label');
const $link = z.string().optional().describe('Link');

const BaseButtonProps = z.object({ label: $label });
export const input = z.object({ label: $label, link: $link });

const BaseButton: React.FC<
  z.infer<typeof BaseButtonProps> & { className?: string }
> = ({ label, className }) => {
  return (
    <button className={cn('button-82-pushable', className)} type="button">
      <span className="button-82-shadow" />
      <span className="button-82-edge" />
      <span className="button-82-front text">{label}</span>

      <style jsx>{`
        .button-82-pushable {
          position: relative;
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          outline-offset: 4px;
          transition: filter 250ms;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }

        .button-82-shadow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          background: hsl(0deg 0% 0% / 0.25);
          will-change: transform;
          transform: translateY(2px);
          transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
        }

        .button-82-edge {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          background: linear-gradient(
            to left,
            hsl(340deg 100% 16%) 0%,
            hsl(340deg 100% 32%) 8%,
            hsl(340deg 100% 32%) 92%,
            hsl(340deg 100% 16%) 100%
          );
        }

        .button-82-front {
          display: block;
          position: relative;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 1.1rem;
          color: white;
          background: hsl(345deg 100% 47%);
          will-change: transform;
          transform: translateY(-4px);
          transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
        }

        @media (min-width: 768px) {
          .button-82-front {
            font-size: 1.25rem;
            padding: 10px 20px;
          }
        }

        .button-82-pushable:hover {
          filter: brightness(110%);
          -webkit-filter: brightness(110%);
        }

        .button-82-pushable:hover .button-82-front {
          transform: translateY(-6px);
          transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
        }

        .button-82-pushable:active .button-82-front {
          transform: translateY(-2px);
          transition: transform 34ms;
        }

        .button-82-pushable:hover .button-82-shadow {
          transform: translateY(4px);
          transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
        }

        .button-82-pushable:active .button-82-shadow {
          transform: translateY(1px);
          transition: transform 34ms;
        }

        .button-82-pushable:focus:not(:focus-visible) {
          outline: none;
        }
      `}</style>
    </button>
  );
};

export default function DontPressMe002({
  label = 'Press Me',
  link
}: z.infer<typeof input>) {
  if (link) {
    return (
      <Link
        className="w-full"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <BaseButton className="w-full" label={label} />
      </Link>
    );
  }

  return <BaseButton className="w-full" label={label} />;
}
