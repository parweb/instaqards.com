'use client';
import React from 'react';
import { Bot, Users, CalendarCheck2 } from 'lucide-react';
import { motion } from 'framer-motion';

const advanced = [
  {
    title: 'Automatisez vos actions',
    description: 'Créez des workflows pour automatiser vos tâches.',
    icon: <Bot size={28} />,
    color: 'text-blue-500'
  },
  {
    title: 'Système d’affiliation',
    description: 'Gagnez des récompenses en invitant des utilisateurs.',
    icon: <Users size={28} />,
    color: 'text-violet-500'
  },
  {
    title: 'Gérez vos réservations',
    description: 'Permettez à vos visiteurs de réserver des créneaux.',
    icon: <CalendarCheck2 size={28} />,
    color: 'text-emerald-500'
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

export const DashboardAdvancedFeatures: React.FC = () => (
  <section className="mb-16">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-stone-900 dark:text-white tracking-tight">
      Fonctionnalités avancées
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {advanced.map((feature, idx) => (
        <motion.div
          key={feature.title}
          className="flex flex-col items-start p-6 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 shadow-md group cursor-pointer"
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
            className={`mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 ${feature.color}`}
            whileHover={{ rotate: 10, scale: 1.18 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {feature.icon}
          </motion.div>
          <h3 className="text-lg font-semibold mb-1 text-stone-900 dark:text-white">
            {feature.title}
          </h3>
          <p className="text-stone-500 dark:text-stone-300 text-sm">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);
