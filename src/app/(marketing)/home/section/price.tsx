'use client';

import type { Price as PriceType } from '@prisma/client';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import useTranslation from 'hooks/use-translation';
import { cn } from 'lib/utils';
import type { Lang } from 'translations';
import { Begin } from './begin';

const features = [
  {
    id: 2,
    label: {
      fr: 'Nom de Domaine personnalisé',
      en: 'Custom Domain Name',
      it: 'Nome Dominio Personalizzato',
      es: 'Nombre de Dominio Personalizado'
    }
  },
  {
    id: 1,
    label: {
      fr: 'Template Prédéfinis',
      en: 'Predefined Templates',
      it: 'Modelli Predefiniti',
      es: 'Plantillas Predefinidas'
    }
  },
  {
    id: 7,
    label: {
      fr: 'Intégration Instagram, Spotify, TikTok, etc.',
      en: 'Integration Instagram, Spotify, TikTok, etc.',
      it: 'Integrazione Instagram, Spotify, TikTok, etc.',
      es: 'Integración Instagram, Spotify, TikTok, etc.'
    }
  },

  {
    id: 3,
    label: {
      fr: 'Nombre de Liens illimité',
      en: 'Unlimited Links',
      it: 'Link Illimitati',
      es: 'Enlaces Ilimitados'
    }
  },
  {
    id: 4,
    label: {
      fr: "Programme d'Affiliation",
      en: 'Affiliate Program',
      it: 'Programma di Affiliazione',
      es: 'Programa de Afiliación'
    }
  },
  {
    id: 5,
    label: {
      fr: 'Statistiques & Reporting',
      en: 'Statistics & Reporting',
      it: 'Statistiche & Reporting',
      es: 'Estadísticas & Reporting'
    }
  },
  {
    id: 6,
    label: {
      fr: 'Support 24h & Assistance',
      en: '24h Support & Assistance',
      it: 'Supporto 24 Ore & Assistenza',
      es: 'Soporte 24 Horas & Asistencia'
    }
  }
];

export const Price: React.FC<{
  lang: Lang;
  prices: PriceType[];
  standalone: boolean;
  begin: boolean;
  trial: boolean;
  border: boolean;
}> = ({ lang, prices, standalone, begin, trial, border }) => {
  const translate = useTranslation();

  const [billingCycle, setBillingCycle] = useState<'year' | 'month'>('year');

  const offer: Partial<Record<typeof billingCycle, PriceType>> = prices.reduce(
    (carry, price) => ({ ...carry, [String(price.interval)]: price }),
    {}
  );

  return (
    <div className="flex flex-col gap-10 px-4">
      {standalone === false && (
        <motion.div
          className="text-center flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-black/5 text-xs font-medium tracking-wide uppercase">
              {translate('page.home.pricing.header.badge')}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              {translate('page.home.pricing.header.title')}
            </h2>

            <p className="text-lg text-gray-600 flex flex-col gap-1">
              <span>
                {translate('page.home.pricing.header.description.one')}
              </span>
              <span>
                {translate('page.home.pricing.header.description.two')}
              </span>
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-center">
        <div className="relative flex gap-2 p-1 rounded-full bg-black/5 ">
          <button
            type="button"
            className={cn(
              'w-40 flex-1 relative z-10 px-4 py-2 rounded-full font-medium transition-colors duration-300 ease-in-out',
              billingCycle === 'month' ? 'text-black' : 'text-gray-500'
            )}
            onClick={() => setBillingCycle('month')}
          >
            {translate('page.home.pricing.monthly')}
          </button>

          <button
            type="button"
            className={cn(
              'flex items-center gap-2 justify-center',
              'w-40 flex-1 relative z-10 px-4 py-2 rounded-full font-medium transition-colors duration-300 ease-in-out',
              billingCycle === 'year' ? 'text-black' : 'text-gray-500'
            )}
            onClick={() => setBillingCycle('year')}
          >
            <span>{translate('page.home.pricing.annual')}</span>

            <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white">
              {(((offer.year?.unit_amount ?? 0) * 12) /
                ((offer.month?.unit_amount ?? 0) * 12) -
                1) *
                100}
              %
            </Badge>
          </button>

          <div
            className="absolute top-1 left-1 h-[calc(100%-8px)] w-40 rounded-full bg-white shadow-xs transition-transform duration-400 ease-&lsqb;cubic-bezier(0.16,1,0.3,1)&rsqb;"
            style={{
              transform:
                billingCycle === 'month'
                  ? 'translateX(0)'
                  : 'translateX(calc(100% + 8px))'
            }}
          />
        </div>
      </div>

      <motion.div
        className={cn(
          'relative md:w-4xl mx-auto flex flex-col lg:flex-row gap-4',
          'transition duration-400 ease-in-out -translate-y-1',
          'shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.02)]',
          'bg-white rounded-2xl border border-gray-100 pt-10 md:p-10',
          border === false && 'shadow-none border-none md:p-0'
        )}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {trial === true && (
          <div className="absolute -top-3 right-0 left-0 flex justify-center">
            <div className="flex flex-col gap-1">
              <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full font-medium text-sm shadow-md">
                {translate('page.home.pricing.trial')}
              </div>

              <div className="text-center text-xs text-gray-500">
                {translate('page.home.pricing.trial.description')}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col gap-4 p-4 justify-center">
          <div className="flex flex-col gap-4 text-center">
            <div className="uppercase text-sm font-medium tracking-wider text-gray-500 mb-2">
              {translate('page.home.pricing.premium')}
            </div>

            <div className="flex items-center justify-center">
              <span className="text-5xl font-semibold">
                {(offer[billingCycle]?.unit_amount ?? 0) / 100}
              </span>

              <span className="text-xl ml-1 font-medium">€</span>

              <span className="text-gray-500 ml-1">
                /{translate('page.home.pricing.monthly')}
              </span>
            </div>

            {billingCycle === 'year' && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="mt-2 text-sm text-gray-500">
                  {translate('page.home.pricing.annual.total').replace(
                    '{number}',
                    String(((offer.year?.unit_amount ?? 0) * 12) / 100)
                  )}
                </div>

                <div className="mt-1 text-sm font-medium text-green-600">
                  {translate('page.home.pricing.annual.discount').replace(
                    '{number}',
                    String(
                      ((offer.month?.unit_amount ?? 0) * 12 -
                        (offer.year?.unit_amount ?? 0) * 12) /
                        100
                    )
                  )}
                </div>
              </motion.div>
            )}

            {begin === true ? (
              <div className="p-3 rounded-md shadow-md border border-gray-100">
                <Begin />
              </div>
            ) : (
              <div>
                <Button>{translate('page.home.pricing.cta')}</Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 justify-center p-4 border-t pt-8 md:border-t-0 md:pt-4">
          <div className="text-sm font-medium mb-4">
            {translate('page.home.pricing.included')}
          </div>

          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li
                key={feature.id}
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-linear-to-br from-green-300/20 to-green-500/20 mr-2 mt-0.5">
                  <Check size={12} className="text-green-600" />
                </div>

                <span className="text-sm text-gray-700">
                  {feature.label[lang]}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

// const Prices = async () => {
//   const products = await db.product.findMany({
//     where: { active: { equals: true } },
//     include: {
//       prices: {
//         where: { active: { equals: true }, interval_count: { equals: 1 } }
//       }
//     }
//   });

//   return (
//     <div
//       id="Prices"
//       className="flex flex-col p-10 gap-20 overflow-hidden max-w-[1200px] justify-center items-center justify-self-center"
//     >
//       <hgroup className="text-center flex flex-col gap-4">
//         <h2 className="text-4xl sm:text-5xl font-[900]">
//           {translate('page.home.price.title')}
//         </h2>
//         <p className="text-gray-600 text-2xl">
//           {translate('page.home.price.description')}
//         </p>
//       </hgroup>

//       <section className="text-center p-4 border-2 border-green-500 bg-green-50 rounded-lg max-w-[1200px] text-green-900">
//         <div className="flex flex-col gap-2">
//           <div className="font-bold text-2xl">
//             {translate('page.home.price.trial.primary')}
//           </div>

//           <div className="text-xl flex items-center gap-6">
//             <div className="flex items-center">
//               <LuArrowBigDown />
//               <LuArrowBigDown />
//               <LuArrowBigDown />
//             </div>

//             {translate('page.home.price.trial.secondary')}

//             <div className="flex items-center">
//               <LuArrowBigDown />
//               <LuArrowBigDown />
//               <LuArrowBigDown />
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="flex items-center justify-center">
//         <PriceTable products={products} className="flex-col sm:flex-row" />
//       </div>
//     </div>
//   );
// };
