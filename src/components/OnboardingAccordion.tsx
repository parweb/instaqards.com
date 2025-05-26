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
        <div className="w-full h-2 bg-gradient-to-r from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/30 dark:to-purple-900/30">
          <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>
        <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="w-96 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-full h-2 bg-gradient-to-r from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/30 dark:to-purple-900/30">
        <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700" />
      </div>

      <div
        className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 cursor-pointer hover:from-indigo-500/15 hover:to-purple-500/15 transition-all duration-200"
        onClick={toggleAccordion}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="w-fit mb-4 px-4 py-1 bg-purple-100 dark:bg-purple-900/30 backdrop-blur-sm text-purple-800 dark:text-purple-300 text-sm font-medium rounded-full border border-purple-200 dark:border-purple-800/50 flex items-center">
              <LuSparkles className="w-4 h-4 mr-2 text-purple-500" />
              <span>{startText}</span>
            </div>

            <h2 className="text-3xl font-cal font-bold text-zinc-900 dark:text-white">
              {titleText}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                {subtitleText}
              </span>
            </h2>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 ml-4"
          >
            <LuChevronDown className="w-6 h-6 text-purple-500" />
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
            <div className="flex flex-col lg:flex-row gap-0">
              <div className="flex flex-col gap-12 p-6">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
