'use client';

import { useAnimatedNumber } from 'hooks/use-animated-number';

interface AnimatedNumberProps {
  value: number;
  duration?: number; // en ms
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 800,
  className
}: AnimatedNumberProps) {
  const display = useAnimatedNumber({ value, duration });

  return <span className={className}>{display}</span>;
}
