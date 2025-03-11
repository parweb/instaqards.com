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
    <button className={cn('button-56', className)} type="button">
      <span className="text">{label}</span>

      <style jsx>{`
        .button-56 {
          letter-spacing: 2px;
          text-decoration: none;
          text-transform: uppercase;
          color: #000;
          cursor: pointer;
          border: 3px solid;
          padding: 10px 20px;
          box-shadow:
            1px 1px 0px 0px,
            2px 2px 0px 0px,
            3px 3px 0px 0px,
            4px 4px 0px 0px,
            5px 5px 0px 0px;
          position: relative;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }

        .button-56:active {
          box-shadow: 0px 0px 0px 0px;
          top: 5px;
          left: 5px;
        }

        @media (min-width: 768px) {
          .button-56 {
            padding: 0.25em 0.75em;
          }
        }
      `}</style>
    </button>
  );
};

export default function DontPressMe005({
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
