import { UserRole } from '@prisma/client';
import { eachDayOfInterval, format, subDays } from 'date-fns';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import {
  LuUsers,
  LuMousePointer,
  LuExternalLink,
  LuPlus,
  LuLayoutDashboard,
  LuArrowRight,
  LuTrendingUp,
  LuCalendar,
  LuStar,
  LuHeartHandshake,
  LuPalette,
  LuChevronRight,
  LuPartyPopper,
  LuZap,
  LuRocket,
  LuWand,
  LuSparkles
} from 'react-icons/lu';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedNumber } from 'components/ui/AnimatedNumber';
import { motion } from 'motion/react';
import { Tooltip, TooltipTrigger, TooltipContent } from 'components/ui/tooltip';
import { WelcomeCard } from 'components/WelcomeCard';

import OverviewStats from 'components/overview-stats';
import PlaceholderCard from 'components/placeholder-card';
import Sites from 'components/sites';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';
import CreateSiteButton from 'components/create-site-button';
import CreateSiteModal from 'components/modal/create-site';
import { MetricCard } from 'components/MetricCard';
import { OnboardingSteps } from 'components/OnboardingSteps';

import 'array-grouping-polyfill';

export default async function Overview() {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  // Récupération des clicks
  const clicks = ([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
    session.user.role
  )
    ? await db.click.findMany({
        where: {
          OR: [
            { site: { userId: { not: null } } },
            { block: { site: { userId: { not: null } } } }
          ]
        },
        orderBy: { createdAt: 'asc' }
      })
    : await db.click.findMany({
        where: {
          OR: [
            { site: { user: { id: session.user.id } } },
            { block: { site: { user: { id: session.user.id } } } }
          ]
        },
        orderBy: { createdAt: 'asc' }
      });

  // Calculer les données pour le graphique
  const splitByDate = clicks.groupBy(({ createdAt }) =>
    createdAt.toDateString()
  );

  const start =
    clicks.length > 0 ? clicks[0]?.createdAt : subDays(new Date(), 7);
  const end = new Date();

  const chartdata = eachDayOfInterval({ start, end }).map(date => {
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

  // Récupérer les sites de l'utilisateur
  const sites = await db.site.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      clicks: true,
      subscribers: true,
      likes: true,
      blocks: {
        include: {
          reservations: {
            where: {
              dateStart: {
                gte: new Date()
              }
            }
          }
        }
      }
    },
    take: 4,
    orderBy: {
      updatedAt: 'desc'
    }
  });

  // Calcul des métriques globales
  const totalClicks = clicks.length;
  const totalSubscribers = sites.reduce(
    (acc, site) => acc + site.subscribers.length,
    0
  );
  const upcomingReservations = sites.reduce(
    (acc, site) =>
      acc +
      site.blocks.reduce(
        (blockAcc, block) => blockAcc + block.reservations.length,
        0
      ),
    0
  );

  // Calculs supplémentaires pour les nouvelles métriques
  const totalSites = sites.length;
  const totalLikes = sites.reduce(
    (acc, site) => acc + (site.likes?.length || 0),
    0
  );
  // Visiteurs uniques (par site, ou global si possible)
  const uniqueVisitors = Array.from(
    new Set(clicks.map(c => c.userId).filter(Boolean))
  ).length;
  // Taux de conversion (abonnés / visiteurs uniques)
  const conversionRate =
    uniqueVisitors > 0 ? (totalSubscribers / uniqueVisitors) * 100 : 0;
  // Taux d'engagement (clics / visiteurs uniques)
  const engagementRate = uniqueVisitors > 0 ? totalClicks / uniqueVisitors : 0;
  // Dernière activité (date du dernier clic ou réservation)
  const lastClick =
    clicks.length > 0 ? clicks[clicks.length - 1].createdAt : null;
  const allReservations = sites
    .flatMap(site => site.blocks.flatMap(block => block.reservations))
    .filter(r => r && r.dateStart);
  const lastReservation =
    allReservations.length > 0
      ? allReservations.sort(
          (a, b) =>
            new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime()
        )[0].dateStart
      : null;
  const lastActivityCandidates = [lastClick, lastReservation].filter(
    (d): d is Date => d instanceof Date && !isNaN(d.getTime())
  );
  const lastActivity =
    lastActivityCandidates.length > 0
      ? lastActivityCandidates.sort((a, b) => b.getTime() - a.getTime())[0]
      : null;
  let lastActivityLabel = 'Aucune activité';
  if (lastActivity) {
    const dateObj =
      typeof lastActivity === 'string' ? new Date(lastActivity) : lastActivity;
    if (!isNaN(dateObj.getTime())) {
      lastActivityLabel = dateObj.toLocaleString();
    }
  }

  // Vérifier si l'utilisateur a des sites
  // const hasSites = sites.length > 0;
  const hasSites = false;

  // Journée actuelle pour les salutations personnalisées
  const hour = new Date().getHours();
  let greeting = 'Bonjour';
  if (hour < 5) greeting = 'Bonne nuit';
  else if (hour < 12) greeting = 'Bonjour';
  else if (hour < 18) greeting = 'Bon après-midi';
  else greeting = 'Bonsoir';

  // Récupérer le nombre total de produits de l'utilisateur
  const totalProducts = await db.product.count({
    where: {
      // Si tu as un champ userId ou similaire sur Product, adapte ici
      // userId: session.user.id
    }
  });

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 overflow-hidden pb-10">
      {/* Motifs décoratifs pour l'ensemble de la page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-5 -top-40 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light blur-3xl"></div>
        <div className="absolute -left-20 top-1/4 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light blur-3xl"></div>
        <div className="absolute right-40 bottom-10 w-56 h-56 bg-pink-500/5 dark:bg-pink-500/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light blur-3xl"></div>

        {/* Motif de points */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="4" cy="4" r="1" fill="#6b7280" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-10 pt-8 space-y-12">
        {hasSites && <><div className="flex flex-col gap-4">
          <div className="flex-1 flex items-center gap-4">
            <MetricCard
              title="Total des clics"
              value={totalClicks}
              icon={<LuMousePointer className="w-6 h-6 text-white" />}
              iconBg="bg-blue-500"
              badge={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`px-2 py-1 text-sm rounded-md ${pourcentVisitors >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}
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
              icon={<LuUsers className="w-6 h-6 text-white" />}
              iconBg="bg-purple-500"
              badge={
                <span className="px-2 py-1 text-sm rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {sites.length} {sites.length > 1 ? 'sites' : 'site'}
                </span>
              }
              bgGradient="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-800/10"
              shadowColor="shadow-purple-100 dark:shadow-purple-900/20"
            />

            <MetricCard
              title="Réservations"
              value={upcomingReservations}
              icon={<LuCalendar className="w-6 h-6 text-white" />}
              iconBg="bg-amber-500"
              badge={
                <span className="px-2 py-1 text-sm rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  À venir
                </span>
              }
              bgGradient="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/10 dark:to-amber-800/10"
              shadowColor="shadow-amber-100 dark:shadow-amber-900/20"
            />

            <MetricCard
              title="Produits"
              value={totalProducts}
              icon={<LuPalette className="w-6 h-6 text-white" />}
              iconBg="bg-fuchsia-500"
              badge={
                <span className="px-2 py-1 text-xs rounded-md bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400">
                  Total
                </span>
              }
              bgGradient="bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-900/10 dark:to-fuchsia-800/10"
              shadowColor="shadow-fuchsia-100 dark:shadow-fuchsia-900/20"
            />

            {/* <MetricCard
              title="Likes reçus"
              value={totalLikes}
              icon={<LuStar className="w-6 h-6 text-white" />}
              iconBg="bg-yellow-500"
              badge={<span className="px-2 py-1 text-xs rounded-md bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Likes</span>}
              bgGradient="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/10 dark:to-yellow-800/10"
              shadowColor="shadow-yellow-100 dark:shadow-yellow-900/20"
            /> */}

            {/* <MetricCard
              title="Visiteurs uniques"
              value={uniqueVisitors}
              icon={<LuUsers className="w-6 h-6 text-white" />}
              iconBg="bg-green-500"
              badge={<span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Uniques</span>}
              bgGradient="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10"
              shadowColor="shadow-green-100 dark:shadow-green-900/20"
            /> */}

            {/* <MetricCard
              title="Taux de conversion"
              value={Math.round(conversionRate)}
              icon={<LuHeartHandshake className="w-6 h-6 text-white" />}
              iconBg="bg-pink-500"
              badge={<span className="px-2 py-1 text-xs rounded-md bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">%</span>}
              bgGradient="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/10 dark:to-pink-800/10"
              shadowColor="shadow-pink-100 dark:shadow-pink-900/20"
            /> */}

            {/* <MetricCard
              title="Taux d'engagement"
              value={Math.round(engagementRate)}
              icon={<LuSparkles className="w-6 h-6 text-white" />}
              iconBg="bg-cyan-500"
              badge={<span className="px-2 py-1 text-xs rounded-md bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">Actions/visiteur</span>}
              bgGradient="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/10 dark:to-cyan-800/10"
              shadowColor="shadow-cyan-100 dark:shadow-cyan-900/20"
            /> */}
          </div>
        </div>

        <OverviewStats
          dailyGrowth={pourcentVisitors}
          chartdata={chartdata}
          total={clicks.length}
        /></>}

        {/* Sites ou Onboarding */}
        {hasSites ? (
          <div className="relative">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 backdrop-filter border border-white/20 dark:border-black/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-cal font-bold text-zinc-900 dark:text-white flex items-center">
                  <LuLayoutDashboard className="w-5 h-5 mr-2 text-purple-500" />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Vos sites
                  </span>
                </h2>
                <Link
                  href="/sites"
                  className="group px-4 py-1.5 rounded-full flex items-center gap-2 font-medium text-sm bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm transition-all"
                >
                  <span>Tous les sites</span>
                  <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
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
                <Sites limit={4} />
              </Suspense>
            </div>
          </div>
        ) : (
          /* Section d'onboarding créative */
          <div className="relative perspective-1000">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 backdrop-filter border border-white/20 dark:border-black/20 overflow-hidden transform-gpu">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

              {/* Barre de progression animée */}
              <div className="w-full h-2 bg-gradient-to-r from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/30 dark:to-purple-900/30">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-r transition-all duration-700"
                  style={{ width: '100%' }}
                />
              </div>
              {/* En-tête avec badge translucide */}
              <div className="relative p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <div className="w-fit mb-4 px-4 py-1 bg-purple-100 dark:bg-purple-900/30 backdrop-blur-sm text-purple-800 dark:text-purple-300 text-sm font-medium rounded-full border border-purple-200 dark:border-purple-800/50 flex items-center">
                  <LuSparkles className="w-4 h-4 mr-2 text-purple-500" />
                  <span>Commencez votre aventure Qards</span>
                </div>

                <h2 className="text-3xl font-cal font-bold text-zinc-900 dark:text-white">
                  Donnez vie à votre{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                    présence en ligne
                  </span>
                </h2>
              </div>

              {/* Contenu principal avec design inspiré des vagues */}
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Colonne de gauche avec étapes */}
                <div className="lg:col-span-7 p-6 pb-10 relative">
                  {/* Vague décorative en arrière-plan */}
                  <div className="absolute -bottom-5 -right-5 w-full h-32 opacity-20">
                    <svg
                      viewBox="0 0 400 400"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0,192 C80,96 160,0 240,0 C320,0 400,96 400,192 C400,288 320,384 240,384 C160,384 80,288 0,192 Z"
                        fill="url(#gradient-steps)"
                      />
                      <defs>
                        <linearGradient
                          id="gradient-steps"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="100%" stopColor="#9f7aea" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <OnboardingSteps
                    steps={[
                      {
                        title: 'Créez facilement votre site',
                        description:
                          'Choisissez un template, personnalisez-le avec notre éditeur visuel - aucun code requis!',
                        icon: (
                          <LuRocket className="inline-block w-5 h-5 mr-2 text-blue-500" />
                        ),
                        color: 'from-blue-500 to-indigo-600'
                      },
                      {
                        title: 'Configurez vos fonctionnalités',
                        description:
                          'Ajoutez des réservations, collectez des contacts, personnalisez votre marque - tout en quelques clics.',
                        icon: (
                          <LuWand className="inline-block w-5 h-5 mr-2 text-purple-500" />
                        ),
                        color: 'from-purple-500 to-pink-500'
                      },
                      {
                        title: 'Lancez et analysez',
                        description:
                          'Partagez votre site et suivez vos performances en temps réel pour optimiser votre présence en ligne.',
                        icon: (
                          <LuStar className="inline-block w-5 h-5 mr-2 text-amber-500" />
                        ),
                        color: 'from-amber-500 to-orange-500'
                      }
                    ]}
                    currentStep={2}
                    createSiteButton={
                      <CreateSiteButton>
                        <CreateSiteModal />
                      </CreateSiteButton>
                    }
                  />
                </div>

                {/* Colonne de droite avec prévisualisation */}
                <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-6 flex items-center justify-center rounded-r-2xl">
                  <div className="relative group flex flex-col items-center">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300 -rotate-2"></div>
                    <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-900">
                      <Image
                        src="/assets_task_01jv240pzpejytyqbf6xd64h42_1747049325_img_0.webp"
                        alt="Website preview"
                        width={400}
                        height={280}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-4 text-white">
                          <div className="text-sm font-medium mb-1">
                            votre-marque.qards.link
                          </div>
                          <div className="text-xs opacity-75">
                            Lancez votre présence en ligne dès aujourd'hui
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badge flottant */}
                    <div className="absolute -top-4 -right-4 bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-3 py-1 rounded-full shadow-md border border-indigo-100 dark:border-indigo-900/50 flex items-center">
                      <LuZap className="w-3 h-3 mr-1 text-amber-500" />
                      <span>Prêt en 5 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
