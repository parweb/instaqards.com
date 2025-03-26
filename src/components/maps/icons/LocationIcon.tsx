import { MapPin } from 'lucide-react';

import { cn } from 'lib/utils';

interface LocationIconProps {
  className?: string;
}

export const LocationIcon = ({ className }: LocationIconProps) => (
  <MapPin className={cn('', className)} />
);
