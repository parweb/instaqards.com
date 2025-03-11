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
    <button className={cn('button-18', className)} type="button">
      {label}

      <style jsx>{`
        .button-18 {
          touch-action: manipulation;
          display: inline-block;
          outline: none;
          box-sizing: border-box;
          border: none;
          border-radius: 0.3em;
          text-transform: uppercase;
          padding: 10px 20px;
          box-shadow:
            0 3px 6px rgba(0, 0, 0, 0.16),
            0 3px 6px rgba(110, 80, 20, 0.4),
            inset 0 -2px 5px 1px rgba(139, 66, 8, 1),
            inset 0 -1px 1px 3px rgba(250, 227, 133, 1);
          background-image: linear-gradient(
            160deg,
            #a54e07,
            #b47e11,
            #fef1a2,
            #bc881b,
            #a54e07
          );
          border: 1px solid #a55d07;
          color: rgb(120, 50, 5);
          text-shadow: 0 2px 2px rgba(250, 227, 133, 1);
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          background-size: 100% 100%;
          background-position: center;
        }
        .button-18:focus,
        .button-18:hover {
          background-size: 150% 150%;
          box-shadow:
            0 10px 20px rgba(0, 0, 0, 0.19),
            0 6px 6px rgba(0, 0, 0, 0.23),
            inset 0 -2px 5px 1px #b17d10,
            inset 0 -1px 1px 3px rgba(250, 227, 133, 1);
          border: 1px solid rgba(165, 93, 7, 0.6);
          color: rgba(120, 50, 5, 0.8);
        }
        .button-18:active {
          box-shadow:
            0 3px 6px rgba(0, 0, 0, 0.16),
            0 3px 6px rgba(110, 80, 20, 0.4),
            inset 0 -2px 5px 1px #b17d10,
            inset 0 -1px 1px 3px rgba(250, 227, 133, 1);
        }
      `}</style>
    </button>
  );
};

export default function Gold({
  label = 'Press me',
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
