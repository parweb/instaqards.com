'use client';
import React from 'react';
import { Eye, MousePointerClick, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    label: 'Visiteurs',
    value: '—',
    icon: <Eye size={28} />,
    color: 'text-blue-500'
  },
  {
    label: 'Clics',
    value: '—',
    icon: <MousePointerClick size={28} />,
    color: 'text-violet-500'
  },
  {
    label: 'Abonnés',
    value: '—',
    icon: <Users size={28} />,
    color: 'text-emerald-500'
  },
  {
    label: 'Sites',
    value: '—',
    icon: <Globe size={28} />,
    color: 'text-blue-400'
  }
];

const cardVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, type: 'spring', stiffness: 80 }
  }
};

export const DashboardStats: React.FC = () => (
  <section className="mb-16">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-stone-900 dark:text-white tracking-tight">
      Statistiques clés
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          className="flex flex-col items-center p-6 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 shadow-md group cursor-pointer"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardVariants}
          whileHover={{
            scale: 1.04,
            boxShadow: '0 4px 24px 0 rgba(31,38,135,0.10)'
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        >
          <motion.div
            className={`mb-2 flex items-center justify-center w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 ${stat.color}`}
            whileHover={{ rotate: 10, scale: 1.18 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {stat.icon}
          </motion.div>
          <span className="text-2xl md:text-3xl font-bold mb-1 text-stone-900 dark:text-white">
            {stat.value}
          </span>
          <span className="text-stone-500 dark:text-stone-300 text-sm">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  </section>
);
