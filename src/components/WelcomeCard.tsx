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
      className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg relative overflow-hidden backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 backdrop-filter border border-white/20 dark:border-black/20"
    >
      <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 blur-3xl rounded-full"></div>
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          {pourcentVisitors > 0 ? (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
              {/* Trending up icon à injecter par le parent si besoin */}
              <span>+{pourcentVisitors.toFixed(0)}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
              {/* Calendar icon à injecter par le parent si besoin */}
              <span>Aujourd'hui</span>
            </div>
          )}
          <div className="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg animate-pulse">
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
          <h1 className="text-3xl font-cal font-bold text-zinc-900 dark:text-white">
            {greeting},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
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
