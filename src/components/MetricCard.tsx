'use client';

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { AnimatedNumber } from 'components/ui/animated-number';

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
      className={`relative flex-1 self-stretch overflow-hidden rounded-xl border border-white/40 bg-white/70 shadow-lg backdrop-blur-md backdrop-saturate-150 dark:border-white/10 dark:bg-zinc-800/70 ${shadowColor} transition-all`}
    >
      <div
        className={`absolute inset-0 ${bgGradient} mix-blend-multiply dark:mix-blend-soft-light`}
      ></div>
      <div className="relative flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`flex h-12 w-12 items-center justify-center rounded-lg shadow-lg ${iconBg}`}
          >
            {icon}
          </motion.div>
          {badge}
        </div>
        <div className="mt-5">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-white">
            <AnimatedNumber value={value} />
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
