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
            'flex transform transition-all hover:scale-[1.01] items-start gap-4'
          }
        >
          <div
            className={cn(
              'w-10 h-10 aspect-square rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold shadow-md',
              step.color
            )}
          >
            {i + 1}
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold flex items-center text-zinc-900 dark:text-white gap-1">
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
