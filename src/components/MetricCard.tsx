'use client';

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { AnimatedNumber } from 'components/ui/AnimatedNumber';

interface MetricCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  badge?: ReactNode;
  bgGradient: string;
  shadowColor: string;
  children?: ReactNode;
}

export function MetricCard({
  title,
  value,
  icon,
  iconBg,
  badge,
  bgGradient,
  shadowColor,
  children
}: MetricCardProps) {
  return (
    <div
      className={`flex-1 relative bg-white/70 dark:bg-zinc-800/70 rounded-xl overflow-hidden shadow-lg border border-white/40 dark:border-white/10 backdrop-blur-md backdrop-saturate-150 ${shadowColor} transition-all`}
    >
      <div
        className={`absolute inset-0 ${bgGradient} mix-blend-multiply dark:mix-blend-soft-light`}
      ></div>
      <div className="relative p-6 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-lg ${iconBg}`}
          >
            {icon}
          </motion.div>
          {badge}
        </div>
        <div className="mt-5">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="text-3xl font-semibold mt-1 text-zinc-900 dark:text-white">
            <AnimatedNumber value={value} />
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
