import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number; // en ms
}

export function useAnimatedNumber({
  value,
  duration = 800
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = value;

    if (start === end) return;

    const increment = (end - start) / (duration / 16);

    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (
        (increment > 0 && current >= end) ||
        (increment < 0 && current <= end)
      ) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return display;
}
