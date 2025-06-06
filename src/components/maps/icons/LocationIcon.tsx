import { LuMapPin } from 'react-icons/lu';

import { cn } from 'lib/utils';

interface LocationIconProps {
  className?: string;
}

export const LocationIcon = ({ className }: LocationIconProps) => (
  <LuMapPin className={cn('', className)} />
);
