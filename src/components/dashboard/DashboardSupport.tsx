'use client';
import React from 'react';
import { BookOpen, MessageCircle, PencilLine } from 'lucide-react';
import { motion } from 'framer-motion';

const supportLinks = [
  {
    href: '/help',
    label: 'Documentation',
    icon: <BookOpen size={22} />,
    color: 'text-blue-500',
    className:
      'bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-base font-medium text-stone-700 dark:text-stone-200'
  },
  {
    href: 'mailto:support@quard.link',
    label: 'Contacter le support',
    icon: <MessageCircle size={22} />,
    color: 'text-white',
    className: 'bg-blue-500 text-white font-semibold'
  },
  {
    href: '/feedback',
    label: 'Donner mon avis',
    icon: <PencilLine size={22} />,
    color: 'text-violet-500',
    className:
      'bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-base font-medium text-stone-700 dark:text-stone-200'
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

export const DashboardSupport: React.FC = () => (
  <section className="mb-16">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-stone-900 dark:text-white tracking-tight">
      Besoin d'aide&nbsp;?
    </h2>
    <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
      {supportLinks.map((link, idx) => (
        <motion.a
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 px-7 py-4 rounded-xl shadow-md group cursor-pointer hover:shadow-lg transition-shadow duration-200 ${link.className}`}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={itemVariants}
          whileHover={{
            scale: 1.04,
            boxShadow: '0 4px 24px 0 rgba(31,38,135,0.10)'
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        >
          <motion.div
            className={`flex items-center justify-center w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 ${link.color}`}
            whileHover={{ rotate: 10, scale: 1.18 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {link.icon}
          </motion.div>
          {link.label}
        </motion.a>
      ))}
    </div>
  </section>
);
