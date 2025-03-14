'use client';

import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useTransition } from 'react';

import { onboard } from 'actions/onboard';
import LoadingDots from 'components/icons/loading-dots';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import useTranslation from 'hooks/use-translation';
import type { Lang } from '../../../../translations';

const features = [
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
    id: 2,
    label: {
      fr: 'Nom de Domaine personnalisé',
      en: 'Custom Domain Name',
      it: 'Nome Dominio Personalizzato',
      es: 'Nombre de Dominio Personalizado'
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

const PricingSection: React.FC<{ lang: Lang }> = ({ lang }) => {
  const translate = useTranslation();

  const [isPending, startTransition] = useTransition();

  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'annual'
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-block mb-2 px-3 py-1 rounded-full bg-black/5 text-xs font-medium tracking-wide uppercase">
          {translate('page.home.pricing.header.badge')}
        </div>

        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mt-2 mb-4">
          {translate('page.home.pricing.header.title')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {translate('page.home.pricing.header.description.one')}
          {translate('page.home.pricing.header.description.two')}
        </p>
      </motion.div>

      <div className="mb-12 flex justify-center">
        <div className="relative flex gap-2 p-1 rounded-full bg-black/5 ">
          <button
            type="button"
            className={`w-40 flex-1 relative z-10 px-4 py-2 rounded-full font-medium transition-colors duration-300 ease-in-out ${billingCycle === 'monthly' ? 'text-black' : 'text-gray-500'}`}
            onClick={() => setBillingCycle('monthly')}
          >
            {translate('page.home.pricing.monthly')}
          </button>

          <button
            type="button"
            className={`flex items-center gap-2 justify-center w-40 flex-1 relative z-10 px-4 py-2 rounded-full font-medium transition-colors duration-300 ease-in-out ${billingCycle === 'annual' ? 'text-black' : 'text-gray-500'}`}
            onClick={() => setBillingCycle('annual')}
          >
            <span>{translate('page.home.pricing.annual')}</span>

            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              {((9 * 12) / (12 * 12) - 1) * 100}%
            </Badge>
          </button>

          <div
            className="absolute top-1 left-1 h-[calc(100%-8px)] w-40 rounded-full bg-white shadow-sm transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform:
                billingCycle === 'monthly'
                  ? 'translateX(0)'
                  : 'translateX(calc(100% + 8px))'
            }}
          />
        </div>
      </div>

      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="transition duration-400 ease-in-out -translate-y-1 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.02)] bg-white rounded-2xl border border-gray-100">
          <div className="absolute -top-3 right-0 left-0 flex justify-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full font-medium text-sm shadow-md">
              {translate('page.home.pricing.trial')}
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-gray-500">
            {translate('page.home.pricing.trial.description')}
          </div>

          <div className="px-8 pt-8 pb-10 text-center border-b mt-4">
            <div className="uppercase text-sm font-medium tracking-wider text-gray-500 mb-2">
              {translate('page.home.pricing.premium')}
            </div>

            <div className="flex items-center justify-center">
              <span className="text-5xl font-semibold">
                {billingCycle === 'monthly' ? '12' : '9'}
              </span>

              <span className="text-xl ml-1 font-medium">€</span>
              <span className="text-gray-500 ml-1">
                /{translate('page.home.pricing.monthly')}
              </span>
            </div>

            {billingCycle === 'annual' && (
              <>
                <div className="mt-2 text-sm text-gray-500">
                  {translate('page.home.pricing.annual.total').replace(
                    '{number}',
                    '108'
                  )}
                </div>
                <div className="mt-1 text-sm font-medium text-green-600">
                  {translate('page.home.pricing.annual.discount').replace(
                    '{number}',
                    '36'
                  )}
                </div>
              </>
            )}
            <form
              onSubmit={async e => {
                e.preventDefault();

                const form = new FormData(e.currentTarget);

                startTransition(() => {
                  onboard({
                    subdomain: String(form.get('subdomain')),
                    email: String(form.get('email'))
                  }).then(data => {
                    console.log({ data });

                    setError(data.error || null);
                  });
                });
              }}
              className="mt-6 flex flex-col gap-4"
            >
              <div className="flex w-full max-w-md">
                <input
                  name="subdomain"
                  type="text"
                  placeholder={translate('page.home.pricing.start.placeholder')}
                  autoCapitalize="off"
                  autoComplete="off"
                  pattern="[a-zA-Z0-9\-]+"
                  maxLength={32}
                  required
                  className="w-full rounded-l-lg border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
                  onChange={e => setSubdomain(e.target.value)}
                  value={subdomain}
                />
                <div className="flex items-center rounded-r-lg border border-l-0 border-stone-200 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                  .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                </div>
              </div>

              {subdomain !== '' && (
                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Input
                    type="email"
                    name="email"
                    required
                    placeholder={translate(
                      'page.home.pricing.start.email.placeholder'
                    )}
                  />
                  {/* <Input
                    type="password"
                    name="password"
                    required
                    placeholder={translate(
                      'page.home.pricing.start.password.placeholder'
                    )}
                  /> */}
                </motion.div>
              )}

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <LoadingDots color="#808080" />
                ) : (
                  translate('page.home.pricing.start')
                )}
              </Button>
            </form>
          </div>
          <div className="px-8 py-8">
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
                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-green-300/20 to-green-500/20 mr-2 mt-0.5">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {feature.label[lang]}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingSection;
