import { UserRole } from '@prisma/client';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { eachDayOfInterval, subDays } from 'date-fns';
import { Suspense } from 'react';

import { CreatorDashboard } from 'components/creator-dashboard';

import {
  LuCalendar,
  LuLayoutDashboard,
  LuMousePointer,
  LuRocket,
  LuStar,
  LuUsers,
  LuWand
} from 'react-icons/lu';

import CreateSiteButton from 'components/create-site-button';
import { MetricCard } from 'components/MetricCard';
import CreateSiteModal from 'components/modal/create-site';
import { OnboardingAccordion } from 'components/OnboardingAccordion';
import { OnboardingChecklist } from 'components/OnboardingChecklist';
import { OnboardingSteps } from 'components/OnboardingSteps';
import OverviewStats from 'components/overview-stats';
import PlaceholderCard from 'components/placeholder-card';
import { ProgressBar } from 'components/progress-bar';
import Sites from 'components/sites';
import { db } from 'helpers/db';
import { rangeParser } from 'helpers/rangeParser';
import { getLang, translate } from 'helpers/translate';
import { getAuth, getSubscription } from 'lib/auth';

import 'array-grouping-polyfill';

const steps = [
  {
    title: {
      fr: 'Créez facilement votre site',
      en: 'Create your site easily',
      it: 'Crea il tuo sito facilmente',
      es: 'Crea tu sitio fácilmente'
    },
    description: {
      fr: 'Choisissez un template, personnalisez-le avec notre éditeur visuel - aucun code requis!',
      en: 'Choose a template, customize it with our visual editor - no code required!',
      it: 'Scegli un template, personalizza-lo con il nostro editor visivo - nessun codice richiesto!',
      es: 'Elige un plantilla, personaliza-la con nuestro editor visual - sin código requerido!'
    },
    icon: <LuRocket className="text-blue-500" />,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: {
      fr: 'Configurez vos fonctionnalités',
      en: 'Configure your features',
      it: 'Configura le tue funzionalità',
      es: 'Configura tus funciones'
    },
    description: {
      fr: 'Ajoutez des réservations, collectez des contacts, personnalisez votre marque - tout en quelques clics.',
      en: 'Add reservations, collect contacts, customize your brand - all in a few clicks.',
      it: 'Aggiungi prenotazioni, raccogli contatti, personalizza il tuo marchio - tutto in pochi clic.',
      es: 'Agrega reservas, recopila contactos, personaliza tu marca - todo en unos pocos clics.'
    },
    icon: <LuWand className="text-purple-500" />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: {
      fr: 'Lancez et analysez',
      en: 'Launch and analyze',
      it: 'Lancia e analizza',
      es: 'Lanza y analiza'
    },
    description: {
      fr: 'Partagez votre site et suivez vos performances en temps réel pour optimiser votre présence en ligne.',
      en: 'Share your site and follow your performance in real time to optimize your online presence.',
      it: 'Condividi il tuo sito e segui le tue prestazioni in tempo reale per ottimizzare la tua presenza online.',
      es: 'Comparte tu sitio y sigue tus rendimientos en tiempo real para optimizar tu presencia en línea.'
    },
    icon: <LuStar className="text-amber-500" />,
    color: 'from-amber-500 to-orange-500'
  }
];

export default async function Overview({
  searchParams
}: {
  searchParams: Promise<{ range: string }>;
}) {
  const params = await searchParams;
  const range = rangeParser.parse(params.range);
  const [lang, auth] = await Promise.all([getLang(), getAuth()]);

  const where = {
    ...(range && {
      createdAt: {
        gte: range.from,
        lte: range.to
      }
    })
  };

  const select = {
    createdAt: true,
    siteId: true,
    blockId: true
  };

  // Si l'utilisateur est un Creator, afficher le dashboard Creator
  if (auth.role === UserRole.CREATOR) {
    return <CreatorDashboard />;
  }

  const clicks = ([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
    auth.role
  )
    ? await db.click.findMany({
        select,
        orderBy: { createdAt: 'asc' },
        where: {
          ...where,
          OR: [{ site: { is: {} } }, { block: { site: { is: {} } } }]
        }
      })
    : await db.click.findMany({
        select,
        orderBy: { createdAt: 'asc' },
        where: {
          ...where,
          OR: [
            { site: { user: { id: auth.id } } },
            { block: { site: { user: { id: auth.id } } } }
          ]
        }
      });

  const splitByDate = clicks.groupBy(({ createdAt }) =>
    createdAt.toDateString()
  );

  const chartdata = eachDayOfInterval({
    start: clicks.length > 0 ? clicks[0]?.createdAt : subDays(new Date(), 7),
    end: new Date()
  }).map(date => {
    const key = date.toDateString();

    return {
      date: key,
      Clicks:
        splitByDate?.[key]?.filter?.(({ siteId }) => siteId === null)?.length ??
        0,
      Visitors:
        splitByDate?.[key]?.filter?.(({ blockId }) => blockId === null)
          ?.length ?? 0
    };
  });

  const [yesterday = null, today = null] = chartdata.slice(-2);

  const pourcentVisitors =
    yesterday && today && yesterday.Visitors > 0
      ? (today.Visitors / yesterday.Visitors - 1) * 100
      : 0;

  const [[sites, affiliateCount], subscription] = await Promise.all([
    db.$transaction([
      db.site.findMany({
        where: { userId: auth.id },
        select: {
          description: true,
          logo: true,
          customDomain: true,
          subscribers: true,
          blocks: { include: { _count: { select: { reservations: true } } } }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      db.user.count({ where: { refererId: auth.id } })
    ]),
    getSubscription()
  ]);

  const totalClicks = clicks.length;
  const totalSubscribers = sites.reduce(
    (acc, site) => acc + site.subscribers.length,
    0
  );

  const upcomingReservations = sites.reduce(
    (acc, site) =>
      acc +
      site.blocks.reduce(
        (blockAcc, block) => blockAcc + block._count.reservations,
        0
      ),
    0
  );

  const checklistState = {
    hasSite: sites.length > 0,
    hasDescription: sites.some(site => site.description && site.logo),
    hasCustomDomain: sites.some(site => site.customDomain),
    hasBlock: sites.some(site => site.blocks.length > 0),
    hasReservation: sites.some(site =>
      site.blocks.some(block => block._count.reservations > 0)
    ),
    hasSubscriber: sites.some(site => site.subscribers.length > 0),
    hasClick: clicks.length > 0,
    hasSubscription: subscription.isPaid(),
    hasAffiliate: affiliateCount > 0,
    hasShare: false
  };

  const total = Object.keys(checklistState).length;
  const completed = Object.values(checklistState).filter(Boolean).length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-100 to-zinc-200 p-0 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      {sites.length > 0 && (
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row">
            <MetricCard
              title="Total des clics"
              value={totalClicks}
              icon={<LuMousePointer className="h-6 w-6 text-white" />}
              iconBg="bg-blue-500"
              badge={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`rounded-md px-2 py-1 text-sm ${pourcentVisitors >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}
                    >
                      {pourcentVisitors >= 0 ? '+' : ''}
                      {pourcentVisitors.toFixed(1)}%
                    </span>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>
                    Croissance par rapport à hier
                  </TooltipContent>
                </Tooltip>
              }
              bgGradient="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10"
              shadowColor="shadow-blue-100 dark:shadow-blue-900/20"
            />

            <MetricCard
              title="Abonnés"
              value={totalSubscribers}
              icon={<LuUsers className="h-6 w-6 text-white" />}
              iconBg="bg-purple-500"
              badge={
                <span className="rounded-md bg-indigo-100 px-2 py-1 text-sm text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {sites.length} {sites.length > 1 ? 'sites' : 'site'}
                </span>
              }
              bgGradient="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-800/10"
              shadowColor="shadow-purple-100 dark:shadow-purple-900/20"
            />

            <MetricCard
              title="Réservations"
              value={upcomingReservations}
              icon={<LuCalendar className="h-6 w-6 text-white" />}
              iconBg="bg-amber-500"
              badge={
                <span className="rounded-md bg-amber-100 px-2 py-1 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  À venir
                </span>
              }
              bgGradient="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/10 dark:to-amber-800/10"
              shadowColor="shadow-amber-100 dark:shadow-amber-900/20"
            />
          </div>

          <OverviewStats
            dailyGrowth={pourcentVisitors}
            chartdata={chartdata}
            total={totalClicks}
          />
        </div>
      )}

      <OnboardingAccordion
        startText={await translate('components.site.presence.start')}
        titleText={await translate('components.site.presence.title')}
        subtitleText={await translate('components.site.presence.subtitle')}
      >
        <OnboardingSteps
          steps={steps.map(step => ({
            ...step,
            title: step.title[lang],
            description: step.description[lang]
          }))}
        />

        <ProgressBar value={percent} />

        <OnboardingChecklist state={checklistState} />
      </OnboardingAccordion>

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-cal flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
            <LuLayoutDashboard className="text-purple-500" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
              {await translate('components.site.title')}
            </span>
          </h2>

          <CreateSiteButton>
            <CreateSiteModal />
          </CreateSiteButton>
        </div>

        <Suspense
          fallback={
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <PlaceholderCard key={index} />
              ))}
            </>
          }
        >
          <Sites />
        </Suspense>
      </div>
    </div>
  );
}
