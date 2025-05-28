'use client';

import { cn } from 'lib/utils';
import { ReactNode } from 'react';

interface Step {
  title: string;
  description: string;
  icon: ReactNode;
  color: string; // ex: 'from-blue-500 to-indigo-600'
}

interface OnboardingStepsProps {
  steps: Step[];
}

export function OnboardingSteps({ steps }: OnboardingStepsProps) {
  return (
    <div className="flex flex-col gap-8">
      {steps.map((step, i) => (
        <div
          key={i}
          className={
            'flex transform items-start gap-4 transition-all hover:scale-[1.01]'
          }
        >
          <div
            className={cn(
              'flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-md',
              step.color
            )}
          >
            {i + 1}
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="flex items-center gap-1 text-lg font-semibold text-zinc-900 dark:text-white">
              {step.icon}
              {step.title}
            </h3>

            <p className="text-zinc-600 dark:text-zinc-400">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
