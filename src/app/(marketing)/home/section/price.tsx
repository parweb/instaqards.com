'use client';

import type { Prisma } from '@prisma/client';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { Alert, AlertTitle } from 'components/ui/alert';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { postData } from 'helpers/api';
import { getStripe } from 'helpers/getStripe';
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
  prices: Prisma.PriceGetPayload<{
    select: {
      interval: true;
    };
  }>[];
  standalone: boolean;
  begin: boolean;
  trial: boolean;
  border: boolean;
}> = ({ lang, prices, standalone, begin, trial, border }) => {
  const translate = useTranslation();

  const [billingCycle, setBillingCycle] = useState<'year' | 'month'>('year');
  const [message, setMessage] = useState<string | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'success' | 'idle'>(
    'idle'
  );

  useEffect(() => {
    setState('idle');
  }, [billingCycle]);

  const offer: Record<
    typeof billingCycle,
    Prisma.PriceGetPayload<{
      select: {
        interval: true;
        unit_amount: true;
        id: true;
      };
    }>
  > = prices.reduce(
    (carry, price) => ({ ...carry, [String(price.interval)]: price }),
    {
      year: null as any,
      month: null as any
    }
  );

  return (
    <div className="flex flex-col gap-10 px-4">
      {standalone === false && (
        <motion.div
          className="flex flex-col gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div>
            <div className="inline-block rounded-full bg-black/5 px-3 py-1 text-xs font-medium tracking-wide uppercase">
              {translate('page.home.pricing.header.badge')}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {translate('page.home.pricing.header.title')}
            </h2>

            <p className="flex flex-col gap-1 text-lg text-gray-600">
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
        <div className="relative flex gap-2 rounded-full bg-black/5 p-1">
          <button
            type="button"
            className={cn(
              'relative z-10 w-40 flex-1 rounded-full px-4 py-2 font-medium transition-colors duration-300 ease-in-out',
              billingCycle === 'month' ? 'text-black' : 'text-gray-500'
            )}
            onClick={() => setBillingCycle('month')}
          >
            {translate('page.home.pricing.monthly')}
          </button>

          <button
            type="button"
            className={cn(
              'flex items-center justify-center gap-2',
              'relative z-10 w-40 flex-1 rounded-full px-4 py-2 font-medium transition-colors duration-300 ease-in-out',
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
            className="ease-&lsqb;cubic-bezier(0.16,1,0.3,1)&rsqb; absolute top-1 left-1 h-[calc(100%-8px)] w-40 rounded-full bg-white shadow-xs transition-transform duration-400"
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
          'relative mx-auto flex flex-col gap-4 md:w-4xl lg:flex-row',
          '-translate-y-1 transition duration-400 ease-in-out',
          'shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.02)]',
          'rounded-2xl border border-gray-100 bg-white pt-10 md:p-10',
          border === false && 'border-none shadow-none md:p-0'
        )}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {trial === true && (
          <div className="absolute -top-3 right-0 left-0 flex justify-center">
            <div className="flex flex-col gap-1">
              <div className="rounded-full bg-linear-to-r from-green-500 to-emerald-600 px-4 py-1 text-sm font-medium text-white shadow-md">
                {translate('page.home.pricing.trial')}
              </div>

              <div className="text-center text-xs text-gray-500">
                {translate('page.home.pricing.trial.description')}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col justify-center gap-4 p-4">
          <div className="flex flex-col gap-4 text-center">
            <div className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
              {translate('page.home.pricing.premium')}
            </div>

            <div className="flex items-center justify-center">
              <span className="text-5xl font-semibold">
                {(offer[billingCycle]?.unit_amount ?? 0) / 100}
              </span>

              <span className="ml-1 text-xl font-medium">€</span>

              <span className="ml-1 text-gray-500">
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

            {state === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{message}</AlertTitle>
              </Alert>
            )}

            {begin === true ? (
              <div className="rounded-md border border-gray-100 p-3 shadow-md">
                <Begin />
              </div>
            ) : (
              <div>
                <Button
                  disabled={['loading', 'success'].includes(state)}
                  type="button"
                  onClick={async () => {
                    try {
                      setState('loading');

                      const response = await postData({
                        url: '/api/create-checkout-session',
                        data: {
                          priceId: offer[billingCycle]?.id
                        }
                      });

                      (await getStripe())?.redirectToCheckout({
                        sessionId: response.sessionId
                      });

                      setState('success');
                    } catch (error: unknown) {
                      console.error({ error });

                      setState('error');
                      setMessage(
                        error instanceof Error ? error.message : 'Unknown error'
                      );
                      // router.refresh();
                    }
                  }}
                >
                  {state === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    translate('page.home.pricing.cta')
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-2 border-t p-4 pt-8 md:border-t-0 md:pt-4">
          <div className="mb-4 text-sm font-medium">
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
                <div className="mt-0.5 mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-green-300/20 to-green-500/20">
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
