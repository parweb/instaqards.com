'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

interface WelcomeCardProps {
  greeting: string;
  user: { name?: string | null; image?: string | null };
  pourcentVisitors: number;
  hasSites: boolean;
  children?: React.ReactNode;
}

export function WelcomeCard({
  greeting,
  user,
  pourcentVisitors,
  hasSites,
  children
}: WelcomeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-opacity-80 dark:bg-opacity-80 relative overflow-hidden rounded-2xl border border-white/20 bg-white p-6 shadow-lg backdrop-blur-sm backdrop-filter dark:border-black/20 dark:bg-zinc-800"
    >
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-40 w-40 rounded-full bg-gradient-to-bl from-blue-500/10 to-purple-500/10 blur-3xl"></div>
      <div className="relative">
        <div className="mb-2 flex items-center gap-3">
          {pourcentVisitors > 0 ? (
            <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
              {/* Trending up icon à injecter par le parent si besoin */}
              <span>+{pourcentVisitors.toFixed(0)}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <span>{"Aujourd'hui"}</span>
            </div>
          )}
          <div className="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xl font-bold text-white shadow-lg">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                (user.name || 'E')[0]
              )}
            </div>
          </div>
          <h1 className="font-cal text-3xl font-bold text-zinc-900 dark:text-white">
            {greeting},{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              {user.name || 'Entrepreneur'}
            </span>
          </h1>
        </div>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          {hasSites
            ? "Votre présence digitale s'améliore. Explorons vos performances du jour."
            : 'Prêt à faire briller votre présence en ligne ? Commençons par créer votre premier site !'}
        </p>
        {!hasSites && children && <div className="mt-6">{children}</div>}
      </div>
    </motion.div>
  );
}
