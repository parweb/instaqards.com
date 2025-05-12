'use client';

import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface Step {
  title: string;
  description: string;
  icon: ReactNode;
  color: string; // ex: 'from-blue-500 to-indigo-600'
}

interface OnboardingStepsProps {
  steps: Step[];
  onCreateSite?: () => void;
  createSiteButton: ReactNode;
}

export function OnboardingSteps({
  steps,
  onCreateSite,
  createSiteButton
}: OnboardingStepsProps) {
  return (
    <div className="relative space-y-8">
      {steps.map((step, i) => (
        <div
          key={i}
          className={
            'relative flex pl-14 transform transition-all hover:scale-105'
          }
        >
          <div
            className={`absolute left-0 top-0 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold shadow-md`}
          >
            {i + 1}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold flex items-center text-zinc-900 dark:text-white">
              {step.icon}
              {step.title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {step.description}
            </p>
          </div>
        </div>
      ))}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
        <div className="group relative inline-flex">
          <div className="absolute -inset-px bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            className="w-full"
          >
            {createSiteButton}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
