'use client';
import React, { useState } from 'react';
import {
  Globe,
  Link2,
  Palette,
  Users,
  FileText,
  BarChart2,
  Bot,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    title: 'Créer un site',
    description: 'Lancez votre premier site en quelques clics.',
    icon: <Globe size={32} />,
    color: 'text-blue-600',
    border: 'from-blue-400 to-blue-600'
  },
  {
    title: 'Ajouter des liens',
    description: 'Ajoutez et suivez vos liens personnalisés.',
    icon: <Link2 size={32} />,
    color: 'text-fuchsia-600',
    border: 'from-fuchsia-400 to-pink-500'
  },
  {
    title: 'Personnaliser ma page',
    description: 'Ajoutez des blocs, widgets et images pour un site unique.',
    icon: <Palette size={32} />,
    color: 'text-emerald-600',
    border: 'from-emerald-400 to-emerald-600'
  },
  {
    title: 'Inviter des abonnés',
    description: 'Développez votre communauté et collectez des emails.',
    icon: <Users size={32} />,
    color: 'text-blue-400',
    border: 'from-blue-300 to-blue-500'
  },
  {
    title: 'Publier du contenu',
    description: 'Partagez des actualités, médias ou offres.',
    icon: <FileText size={32} />,
    color: 'text-fuchsia-400',
    border: 'from-fuchsia-300 to-fuchsia-500'
  },
  {
    title: 'Consulter mes statistiques',
    description: 'Analysez vos visiteurs, clics et abonnés.',
    icon: <BarChart2 size={32} />,
    color: 'text-emerald-400',
    border: 'from-emerald-300 to-emerald-500'
  },
  {
    title: 'Automatiser des actions',
    description: 'Créez des workflows pour gagner du temps.',
    icon: <Bot size={32} />,
    color: 'text-blue-400',
    border: 'from-blue-300 to-blue-500'
  },
  {
    title: 'Gérer mes abonnements',
    description: 'Accédez à vos plans, paiements et factures.',
    icon: <CreditCard size={32} />,
    color: 'text-fuchsia-600',
    border: 'from-fuchsia-400 to-fuchsia-600'
  }
];

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, type: 'spring', stiffness: 80 }
  }
};

export const DashboardFeaturesGrid: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="mb-16 relative">
      {/* Dégradé de fond section */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-fuchsia-50 to-emerald-50 dark:from-blue-950 dark:via-fuchsia-950 dark:to-emerald-950 opacity-80 rounded-2xl" />
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-600 to-emerald-500">
        Que puis-je faire&nbsp;?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            className={`group flex flex-col items-start p-6 rounded-xl bg-white/80 dark:bg-stone-900/80 border-2 shadow-lg hover:shadow-2xl transition-shadow duration-200 border-transparent hover:border-transparent bg-clip-padding relative overflow-hidden cursor-pointer`}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            whileHover={{
              scale: 1.045,
              y: -4,
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)'
            }}
            whileTap={{ scale: 0.97, y: 2 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            style={{ zIndex: 2 }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Glow et border animée */}
            <motion.div
              className={`absolute inset-0 pointer-events-none rounded-xl border-2 border-transparent`}
              style={{ zIndex: 1 }}
              animate={
                hovered === idx
                  ? {
                      boxShadow:
                        '0 0 32px 8px rgba(80,80,255,0.18), 0 0 0 4px #fff3'
                    }
                  : { boxShadow: 'none' }
              }
              transition={{ duration: 0.4, type: 'spring' }}
            >
              <motion.div
                className={`absolute inset-0 rounded-xl opacity-60 group-hover:opacity-90 transition-all duration-300 bg-gradient-to-br ${feature.border}`}
                animate={
                  hovered === idx
                    ? { backgroundPosition: '200% 0%' }
                    : { backgroundPosition: '0% 0%' }
                }
                style={{ backgroundSize: '200% 200%' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            </motion.div>
            <motion.div
              className={`relative z-10 mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-white/80 dark:bg-stone-900/80 ${feature.color}`}
              whileHover={{ rotate: 8, scale: 1.12 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="relative z-10 text-lg font-semibold mb-1 text-stone-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="relative z-10 text-stone-600 dark:text-stone-300 text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
