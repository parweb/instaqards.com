'use client';
import React, { useState } from 'react';
import {
  Globe,
  Link2,
  Palette,
  FileText,
  Users,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    label: 'Créer votre premier site',
    done: false,
    icon: <Globe size={24} />,
    color: 'text-blue-500',
    tip: 'Un premier pas vers la magie !'
  },
  {
    label: 'Ajouter un lien',
    done: false,
    icon: <Link2 size={24} />,
    color: 'text-fuchsia-500',
    tip: 'Partagez ce qui compte pour vous.'
  },
  {
    label: 'Personnaliser votre page',
    done: false,
    icon: <Palette size={24} />,
    color: 'text-emerald-500',
    tip: 'Votre univers, votre style.'
  },
  {
    label: 'Publier un contenu',
    done: false,
    icon: <FileText size={24} />,
    color: 'text-blue-400',
    tip: 'Exprimez-vous, inspirez !'
  },
  {
    label: 'Inviter des abonnés',
    done: false,
    icon: <Users size={24} />,
    color: 'text-violet-400',
    tip: "Une communauté, c'est la vie."
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

export const DashboardOnboardingChecklist: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const completed = steps.filter(s => s.done).length;
  const percent = Math.round((completed / steps.length) * 100);

  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-stone-900 dark:text-white tracking-tight">
        Commencez ici
      </h2>
      <div className="mb-8 w-full bg-stone-100 dark:bg-stone-800 rounded-full h-3 shadow-inner relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-3 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ul className="space-y-4">
        {steps.map((step, idx) => (
          <motion.li
            key={step.label}
            className={`flex items-center gap-4 px-6 py-4 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 shadow-md group cursor-pointer relative overflow-visible ${step.done ? 'opacity-60' : ''}`}
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
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-xl border-2 border-transparent"
              animate={
                hovered === idx
                  ? {
                      boxShadow:
                        '0 0 24px 6px rgba(80,80,255,0.13), 0 0 0 2px #fff3'
                    }
                  : { boxShadow: 'none' }
              }
              transition={{ duration: 0.4, type: 'spring' }}
              style={{ zIndex: 1 }}
            />
            <motion.div
              className={`flex items-center justify-center w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 ${step.color}`}
              whileHover={{ rotate: 10, scale: 1.18 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {step.icon}
            </motion.div>
            <span
              className={`text-base md:text-lg font-medium ${step.done ? 'line-through text-stone-400' : 'text-stone-700 dark:text-stone-100'}`}
            >
              {step.label}
            </span>
            {step.done && (
              <CheckCircle2 size={20} className="ml-auto text-emerald-500" />
            )}
            <AnimatePresence>
              {hovered === idx && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-2 z-20 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-100 via-fuchsia-100 to-emerald-100 dark:from-blue-900 dark:via-fuchsia-900 dark:to-emerald-900 text-xs text-stone-700 dark:text-stone-100 shadow-lg pointer-events-none"
                >
                  {step.tip}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};
