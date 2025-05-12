'use client';
import React from 'react';
import { Sparkles, Puzzle, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const suggestions = [
  {
    text: "Vous n'avez pas encore publié de contenu, essayez maintenant !",
    icon: <Sparkles size={22} />,
    color: 'text-blue-500'
  },
  {
    text: 'Ajoutez un bloc pour enrichir votre page.',
    icon: <Puzzle size={22} />,
    color: 'text-violet-500'
  },
  {
    text: 'Invitez vos premiers abonnés.',
    icon: <Users size={22} />,
    color: 'text-emerald-500'
  }
];

const itemVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, type: 'spring', stiffness: 80 }
  }
};

export const DashboardSuggestions: React.FC = () => (
  <section className="mb-16">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-stone-900 dark:text-white tracking-tight">
      Suggestions pour vous
    </h2>
    <ul className="space-y-5">
      {suggestions.map((suggestion, idx) => (
        <motion.li
          key={idx}
          className="flex items-center gap-3 p-6 bg-white/70 dark:bg-stone-900/70 rounded-xl border border-stone-200 dark:border-stone-800 shadow-md group cursor-pointer text-base md:text-lg font-medium text-stone-700 dark:text-stone-200"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            boxShadow: '0 4px 24px 0 rgba(31,38,135,0.10)'
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        >
          <motion.div
            className={`flex items-center justify-center w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 ${suggestion.color}`}
            whileHover={{ rotate: 10, scale: 1.18 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {suggestion.icon}
          </motion.div>
          <span>{suggestion.text}</span>
        </motion.li>
      ))}
    </ul>
  </section>
);
