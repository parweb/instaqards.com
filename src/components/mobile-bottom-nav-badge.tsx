import { cn } from 'lib/utils';

interface MobileBottomNavBadgeProps {
  count?: number;
  show?: boolean;
  className?: string;
}

export const MobileBottomNavBadge: React.FC<MobileBottomNavBadgeProps> = ({
  count,
  show = false,
  className
}) => {
  if (!show && !count) return null;

  return (
    <div
      className={cn(
        'absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center',
        className
      )}
    >
      {count && count > 99 ? '99+' : count || ''}
    </div>
  );
};
