'use client';

import { useAnimatedNumber } from 'hooks/use-animated-number';

export function ProgressBar({ value }: { value: number }) {
  const percent = useAnimatedNumber({ value, duration: 1000 });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Progression
        </span>

        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {percent}%
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
