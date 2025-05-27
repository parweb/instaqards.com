import { cn } from 'lib/utils';

interface QardIconProps {
  className?: string;
}

export const QardIcon: React.FC<QardIconProps> = ({ className }) => {
  return (
    <svg
      className={cn('w-5 h-5', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="8"
        cy="10"
        r="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16 8v8M13 11h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
