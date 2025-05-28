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
        'absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white',
        className
      )}
    >
      {count && count > 99 ? '99+' : count || ''}
    </div>
  );
};
