'use client';

import { LuChevronDown, LuSparkles } from 'react-icons/lu';
import { motion, AnimatePresence } from 'motion/react';
import { useOnboardingAccordion } from 'hooks/use-onboarding-accordion';

interface OnboardingAccordionProps {
  children: React.ReactNode;
  startText?: string;
  titleText?: string;
  subtitleText?: string;
}

export function OnboardingAccordion({
  children,
  startText = 'Commencez votre présence en ligne',
  titleText = 'Créez votre site web',
  subtitleText = 'professionnel'
}: OnboardingAccordionProps) {
  const { isOpen, isLoaded, toggleAccordion } = useOnboardingAccordion();

  if (!isLoaded) {
    // Skeleton pendant le chargement
    return (
      <div className="animate-pulse">
        <div className="h-2 w-full bg-gradient-to-r from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/30 dark:to-purple-900/30">
          <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6">
          <div className="mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-96 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="h-2 w-full bg-gradient-to-r from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/30 dark:to-purple-900/30">
        <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700" />
      </div>

      <div
        className="cursor-pointer bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 transition-all duration-200 hover:from-indigo-500/15 hover:to-purple-500/15"
        onClick={toggleAccordion}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-4 flex w-fit items-center rounded-full border border-purple-200 bg-purple-100 px-4 py-1 text-sm font-medium text-purple-800 backdrop-blur-sm dark:border-purple-800/50 dark:bg-purple-900/30 dark:text-purple-300">
              <LuSparkles className="mr-2 h-4 w-4 text-purple-500" />
              <span>{startText}</span>
            </div>

            <h2 className="font-cal text-3xl font-bold text-zinc-900 dark:text-white">
              {titleText}{' '}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
                {subtitleText}
              </span>
            </h2>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 flex-shrink-0"
          >
            <LuChevronDown className="h-6 w-6 text-purple-500" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0 lg:flex-row">
              <div className="flex flex-col gap-12 p-6">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
