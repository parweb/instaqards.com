import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCreatorSystem() {
  console.log('🎮 Seeding Creator System...');

  // Créer les niveaux Creator (maintenant basés sur les points)
  const levels = await Promise.all([
    prisma.creatorLevel.upsert({
      where: { level: 1 },
      update: {},
      create: {
        level: 1,
        name: 'Débutant',
        description: "Bienvenue dans l'aventure Creator !",
        requiredPoints: 0,
        requiredSites: 0,
        pointsMultiplier: 1.0, // 100% des points de base
        color: '#10B981'
      }
    }),
    prisma.creatorLevel.upsert({
      where: { level: 2 },
      update: {},
      create: {
        level: 2,
        name: 'Apprenti',
        description: 'Vous commencez à maîtriser les bases',
        requiredPoints: 500,
        requiredSites: 3,
        pointsMultiplier: 1.1, // +10% de points
        color: '#3B82F6'
      }
    }),
    prisma.creatorLevel.upsert({
      where: { level: 3 },
      update: {},
      create: {
        level: 3,
        name: 'Expert',
        description: 'Vos compétences sont reconnues',
        requiredPoints: 1500,
        requiredSites: 10,
        pointsMultiplier: 1.25, // +25% de points
        color: '#8B5CF6'
      }
    }),
    prisma.creatorLevel.upsert({
      where: { level: 4 },
      update: {},
      create: {
        level: 4,
        name: 'Maître',
        description: 'Vous êtes un véritable professionnel',
        requiredPoints: 3000,
        requiredSites: 25,
        pointsMultiplier: 1.5, // +50% de points
        color: '#F59E0B'
      }
    }),
    prisma.creatorLevel.upsert({
      where: { level: 5 },
      update: {},
      create: {
        level: 5,
        name: 'Legend',
        description: 'Le niveau ultime des Creators',
        requiredPoints: 5000,
        requiredSites: 50,
        pointsMultiplier: 2.0, // Double points !
        color: '#EF4444'
      }
    })
  ]);

  // Créer des badges
  const badges = await Promise.all([
    prisma.badge.upsert({
      where: { id: 'first-site' },
      update: {},
      create: {
        id: 'first-site',
        name: 'Premier Site',
        description: 'Créez votre premier site',
        category: 'MILESTONE',
        rarity: 'COMMON',
        condition: 'Créer 1 site',
        targetValue: 1,
        iconUrl: '/badges/first-site.svg',
        color: '#10B981'
      }
    }),
    prisma.badge.upsert({
      where: { id: 'social-master' },
      update: {},
      create: {
        id: 'social-master',
        name: 'Maître des Réseaux',
        description: 'Partagez sur toutes les plateformes',
        category: 'ACHIEVEMENT',
        rarity: 'RARE',
        condition: 'Partager sur 4 plateformes différentes',
        targetValue: 4,
        iconUrl: '/badges/social-master.svg',
        color: '#3B82F6'
      }
    }),
    prisma.badge.upsert({
      where: { id: 'halloween-2024' },
      update: {},
      create: {
        id: 'halloween-2024',
        name: 'Halloween 2024',
        description: "Participez à l'événement Halloween",
        category: 'SEASONAL',
        rarity: 'EPIC',
        condition: 'Compléter une quête Halloween',
        targetValue: 1,
        iconUrl: '/badges/halloween-2024.svg',
        color: '#F97316'
      }
    })
  ]);

  // Créer des récompenses (maintenant basées sur les points)
  const rewards = await Promise.all([
    prisma.reward.upsert({
      where: { id: 'points-100' },
      update: {},
      create: {
        id: 'points-100',
        title: '100 Points',
        description: 'Gagnez 100 points Creator',
        type: 'POINTS',
        rarity: 'COMMON',
        pointsValue: 100,
        imageUrl: '/rewards/points-100.svg'
      }
    }),
    prisma.reward.upsert({
      where: { id: 'points-multiplier-2x' },
      update: {},
      create: {
        id: 'points-multiplier-2x',
        title: 'Double Points x7j',
        description: 'Doublez vos points pendant 7 jours',
        type: 'POINTS_MULTIPLIER',
        rarity: 'RARE',
        pointsMultiplier: 2.0,
        duration: 7,
        imageUrl: '/rewards/points-multiplier.svg',
        color: '#F59E0B'
      }
    }),
    prisma.reward.upsert({
      where: { id: 'vip-access' },
      update: {},
      create: {
        id: 'vip-access',
        title: 'Accès VIP',
        description: 'Accès prioritaire aux nouvelles fonctionnalités',
        type: 'SPECIAL_ACCESS',
        rarity: 'LEGENDARY',
        duration: 30,
        imageUrl: '/rewards/vip-access.svg',
        color: '#8B5CF6'
      }
    })
  ]);

  // Créer des quêtes d'exemple (maintenant avec points et récurrence)
  const quests = await Promise.all([
    // Quête ponctuelle
    prisma.quest.upsert({
      where: { id: 'halloween-spooky-sites' },
      update: {},
      create: {
        id: 'halloween-spooky-sites',
        title: "Sites Effrayants d'Halloween",
        description: 'Créez des sites sur le thème Halloween et partagez-les',
        type: 'SEASONAL',
        difficulty: 'MEDIUM',
        pointsReward: 500,
        // pointsMultiplier: 1.2, // TODO: Activer après génération Prisma
        // multiplierDuration: 5,
        targetValue: 3,
        theme: 'Halloween',
        imageUrl: '/quests/halloween-sites.jpg',
        priority: 1,
        endDate: new Date('2024-11-01'),
        steps: {
          create: [
            {
              title: 'Créer un site Halloween',
              description: 'Créez un site avec un thème effrayant',
              order: 1,
              targetType: 'site_created',
              targetValue: 1
            },
            {
              title: 'Personnaliser le design',
              description: 'Ajoutez des éléments Halloween (couleurs, images)',
              order: 2,
              targetType: 'site_customized',
              targetValue: 1
            },
            {
              title: 'Partager sur les réseaux',
              description: 'Partagez votre site sur au moins 2 plateformes',
              order: 3,
              targetType: 'social_shares',
              targetValue: 2
            },
            {
              title: 'Générer du trafic',
              description: 'Obtenez au moins 50 clics sur votre site',
              order: 4,
              targetType: 'clicks',
              targetValue: 50
            }
          ]
        }
      }
    }),
    // Quête ponctuelle
    prisma.quest.upsert({
      where: { id: 'first-conversion' },
      update: {},
      create: {
        id: 'first-conversion',
        title: 'Première Conversion',
        description: 'Obtenez votre première conversion de prospect',
        type: 'CONVERSION',
        difficulty: 'HARD',
        pointsReward: 1000,
        // badgeReward: 'first-conversion',
        targetValue: 1,
        imageUrl: '/quests/first-conversion.jpg',
        steps: {
          create: [
            {
              title: 'Créer un site Lead',
              description: 'Créez un site optimisé pour la génération de leads',
              order: 1,
              targetType: 'site_created',
              targetValue: 1
            },
            {
              title: 'Optimiser le contenu',
              description: 'Ajoutez des call-to-action efficaces',
              order: 2,
              targetType: 'site_optimized',
              targetValue: 1
            },
            {
              title: 'Promouvoir activement',
              description: 'Partagez sur tous vos canaux',
              order: 3,
              targetType: 'promotion_complete',
              targetValue: 1
            },
            {
              title: 'Convertir un prospect',
              description: 'Obtenez votre première conversion',
              order: 4,
              targetType: 'conversions',
              targetValue: 1
            }
          ]
        }
      }
    }),
    // Quête récurrente quotidienne
    prisma.quest.upsert({
      where: { id: 'daily-social-share' },
      update: {},
      create: {
        id: 'daily-social-share',
        title: 'Partage Quotidien',
        description: 'Partagez un de vos sites sur les réseaux sociaux',
        type: 'SOCIAL_SHARING',
        difficulty: 'EASY',
        pointsReward: 50,
        targetValue: 1,
        // isRecurring: true,
        // frequency: 'daily',
        timeLimit: 24, // 24 heures pour compléter
        imageUrl: '/quests/daily-share.jpg'
      }
    }),
    // Quête récurrente hebdomadaire
    prisma.quest.upsert({
      where: { id: 'weekly-site-creation' },
      update: {},
      create: {
        id: 'weekly-site-creation',
        title: 'Créateur Hebdomadaire',
        description: 'Créez au moins 2 nouveaux sites cette semaine',
        type: 'SITE_CREATION',
        difficulty: 'MEDIUM',
        pointsReward: 200,
        targetValue: 2,
        // isRecurring: true,
        // frequency: 'weekly',
        // dayOfWeek: 1, // Lundi
        timeLimit: 168, // 1 semaine en heures
        imageUrl: '/quests/weekly-creation.jpg'
      }
    }),
    // Quête récurrente mensuelle
    prisma.quest.upsert({
      where: { id: 'monthly-conversion-master' },
      update: {},
      create: {
        id: 'monthly-conversion-master',
        title: 'Maître des Conversions',
        description: 'Obtenez 10 conversions ce mois-ci',
        type: 'CONVERSION',
        difficulty: 'EXPERT',
        pointsReward: 1500,
        targetValue: 10,
        // isRecurring: true,
        // frequency: 'monthly',
        // dayOfMonth: 1, // 1er du mois
        imageUrl: '/quests/monthly-conversions.jpg'
      }
    })
  ]);

  // Créer des templates de notification
  const notificationTemplates = await Promise.all([
    prisma.notificationTemplate.upsert({
      where: { id: 'quest-completed' },
      update: {},
      create: {
        id: 'quest-completed',
        name: 'Quête Complétée',
        type: 'QUEST_COMPLETED',
        title: '🎉 Quête complétée !',
        message:
          'Félicitations ! Vous avez terminé la quête "{questTitle}". Réclamez vos récompenses !',
        priority: 'HIGH',
        actionUrl: '/affiliation?tab=rewards'
      }
    }),
    prisma.notificationTemplate.upsert({
      where: { id: 'level-up' },
      update: {},
      create: {
        id: 'level-up',
        name: 'Montée de Niveau',
        type: 'LEVEL_UP',
        title: '⭐ Niveau supérieur atteint !',
        message:
          'Bravo ! Vous êtes maintenant {levelName} avec un multiplicateur de {pointsMultiplier}x !',
        priority: 'HIGH',
        actionUrl: '/affiliation?tab=levels'
      }
    }),
    prisma.notificationTemplate.upsert({
      where: { id: 'new-quest' },
      update: {},
      create: {
        id: 'new-quest',
        name: 'Nouvelle Quête',
        type: 'QUEST_NEW',
        title: '🎯 Nouvelle quête disponible !',
        message:
          'Une nouvelle quête "{questTitle}" est maintenant disponible. Relevez le défi !',
        priority: 'MEDIUM',
        actionUrl: '/affiliation?tab=quests'
      }
    }),
    prisma.notificationTemplate.upsert({
      where: { id: 'points-earned' },
      update: {},
      create: {
        id: 'points-earned',
        name: 'Points Gagnés',
        type: 'POINTS_EARNED',
        title: '💰 Nouveaux points gagnés !',
        message:
          'Vous avez gagné {points} points ! Total : {totalPoints} points.',
        priority: 'MEDIUM',
        actionUrl: '/affiliation?tab=analytics'
      }
    })
  ]);

  console.log('✅ Creator System seeded successfully!');
  console.log(
    `Created ${levels.length} levels, ${badges.length} badges, ${rewards.length} rewards, ${quests.length} quests`
  );
}

// Fonction utilitaire pour créer des données de test pour un Creator
export async function createTestCreatorData(userId: string) {
  // TODO: Uncomment when userLevel model exists in schema
  // // Créer le niveau utilisateur
  // const userLevel = await prisma.userLevel.upsert({
  //   where: { userId },
  //   update: {},
  //   create: {
  //     userId,
  //     currentLevel: 1,
  //     currentPoints: 250,
  //     totalPoints: 450, // A gagné 450 points au total, en a dépensé 200
  //     levelProgress: 50,
  //     levelId: (await prisma.creatorLevel.findFirst({ where: { level: 1 } }))!
  //       .id
  //   }
  // });

  // Créer quelques transactions de points
  const pointsTransactions = await Promise.all([
    prisma.pointsTransaction.create({
      data: {
        userId,
        amount: 100,
        type: 'earned',
        source: 'conversion',
        description: 'Conversion lead - Site Restaurant',
        metadata: { siteId: 'site-123', conversionType: 'lead' }
      }
    }),
    prisma.pointsTransaction.create({
      data: {
        userId,
        amount: 50,
        type: 'earned',
        source: 'social_share',
        description: 'Partage Facebook - Site Restaurant',
        metadata: { platform: 'facebook', siteId: 'site-123' }
      }
    }),
    prisma.pointsTransaction.create({
      data: {
        userId,
        amount: 200,
        type: 'spent',
        source: 'withdrawal',
        description: 'Retrait vers PayPal',
        metadata: { withdrawalId: 'withdrawal-123' }
      }
    })
  ]);

  // TODO: Uncomment when creatorMetric model exists in schema
  // // Créer quelques métriques
  // const today = new Date();
  // const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  // await Promise.all([
  //   prisma.creatorMetric.upsert({
  //     where: {
  //       userId_type_period_periodStart: {
  //         userId,
  //         type: 'CLICKS',
  //         period: 'WEEKLY',
  //         periodStart: thisWeek
  //       }
  //     },
  //     update: {},
  //     create: {
  //       userId,
  //       type: 'CLICKS',
  //       period: 'WEEKLY',
  //       value: 156,
  //       periodStart: thisWeek,
  //       periodEnd: today
  //     }
  //   }),
  //   prisma.creatorMetric.upsert({
  //     where: {
  //       userId_type_period_periodStart: {
  //         userId,
  //         type: 'CONVERSIONS',
  //         period: 'WEEKLY',
  //         periodStart: thisWeek
  //       }
  //     },
  //     update: {},
  //     create: {
  //       userId,
  //       type: 'CONVERSIONS',
  //       period: 'WEEKLY',
  //       value: 3,
  //       periodStart: thisWeek,
  //       periodEnd: today
  //     }
  //   }),
  //   prisma.creatorMetric.upsert({
  //     where: {
  //       userId_type_period_periodStart: {
  //         userId,
  //         type: 'POINTS_EARNED',
  //         period: 'WEEKLY',
  //         periodStart: thisWeek
  //       }
  //     },
  //     update: {},
  //     create: {
  //       userId,
  //       type: 'POINTS_EARNED',
  //       period: 'WEEKLY',
  //       value: 450,
  //       periodStart: thisWeek,
  //       periodEnd: today
  //     }
  //   })
  // ]);

  // Créer des préférences de notification
  await prisma.notificationPreference.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      questNotifications: true,
      rewardNotifications: true,
      levelNotifications: true,
      systemNotifications: true,
      emailEnabled: true,
      pushEnabled: true,
      inAppEnabled: true,
      digestFrequency: 'daily'
    }
  });

  // Créer un retrait d'exemple
  await prisma.withdrawal.create({
    data: {
      userId,
      pointsAmount: 200,
      euroAmount: 20.0, // 10 points = 1 euro
      exchangeRate: 0.1,
      status: 'completed',
      paymentMethod: 'paypal',
      paymentData: { email: 'creator@example.com' },
      requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Il y a 7 jours
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // Il y a 5 jours
    }
  });

  console.log(`✅ Test data created for Creator ${userId}`);
}
