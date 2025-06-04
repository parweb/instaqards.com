import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BadgeProgress {
  badgeId: string;
  badge: {
    name: string;
    description: string;
    category: string;
    condition: string;
    targetValue: number | null;
    iconUrl: string;
    color: string;
  };
  progress: number; // 0-100
  currentValue: number;
  targetValue: number;
  isEarned: boolean;
  earnedAt: Date | null;
}

export interface UserBadgeWithProgress {
  badgeId: string;
  name: string;
  description: string;
  category: string;
  iconUrl: string;
  color: string;
  earnedAt: Date;
  progress: number; // 100 si earned
}

export class CreatorBadgeService {
  /**
   * Calculer la progression d'un badge pour un utilisateur
   */
  async getBadgeProgress(
    userId: string,
    badgeId: string
  ): Promise<BadgeProgress> {
    const badge = await prisma.badge.findUnique({
      select: {
        name: true,
        description: true,
        category: true,
        condition: true,
        targetValue: true,
        iconUrl: true,
        color: true
      },
      where: { id: badgeId }
    });

    if (!badge) {
      throw new Error('Badge not found');
    }

    const userBadge = await prisma.userBadge.findUnique({
      select: {
        earnedAt: true
      },
      where: {
        userId_badgeId: { userId, badgeId }
      }
    });

    // Si le badge est déjà obtenu
    if (userBadge) {
      return {
        badgeId,
        badge: {
          name: badge.name,
          description: badge.description,
          category: badge.category,
          condition: badge.condition,
          targetValue: badge.targetValue,
          iconUrl: badge.iconUrl,
          color: badge.color
        },
        progress: 100,
        currentValue: badge.targetValue || 1,
        targetValue: badge.targetValue || 1,
        isEarned: true,
        earnedAt: userBadge.earnedAt
      };
    }

    // Calculer la progression selon la condition
    const { currentValue, targetValue } =
      await this.calculateProgressByCondition(
        userId,
        badge.condition,
        badge.targetValue
      );

    const progress =
      targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;

    return {
      badgeId,
      badge: {
        name: badge.name,
        description: badge.description,
        category: badge.category,
        condition: badge.condition,
        targetValue: badge.targetValue,
        iconUrl: badge.iconUrl,
        color: badge.color
      },
      progress,
      currentValue,
      targetValue,
      isEarned: false,
      earnedAt: null
    };
  }

  /**
   * Calculer la progression selon la condition du badge
   */
  private async calculateProgressByCondition(
    userId: string,
    condition: string,
    targetValue: number | null
  ): Promise<{ currentValue: number; targetValue: number }> {
    const target = targetValue || 1;

    switch (condition) {
      case 'total_points':
        const totalPoints = await prisma.pointsTransaction.aggregate({
          where: { userId, type: 'earned' },
          _sum: { amount: true }
        });
        return {
          currentValue: totalPoints._sum.amount || 0,
          targetValue: target
        };

      case 'total_conversions':
        const conversions = await prisma.conversionTracking.count({
          where: { creatorId: userId }
        });
        return { currentValue: conversions, targetValue: target };

      case 'total_shares':
        const shares = await prisma.socialShareTracking.count({
          where: { creatorId: userId }
        });
        return { currentValue: shares, targetValue: target };

      case 'total_sites':
        const sites = await prisma.site.count({
          where: { userId }
        });
        return { currentValue: sites, targetValue: target };

      case 'quests_completed':
        const completedQuests = await prisma.userQuest.count({
          where: { userId, status: 'COMPLETED' }
        });
        return { currentValue: completedQuests, targetValue: target };

      case 'days_active':
        // Calculer les jours où l'utilisateur a été actif (avec des transactions)
        const activeDays = await prisma.pointsTransaction.groupBy({
          by: ['createdAt'],
          where: { userId },
          _count: true
        });
        const uniqueDays = new Set(
          activeDays.map(day => day.createdAt.toDateString())
        ).size;
        return { currentValue: uniqueDays, targetValue: target };

      case 'level_reached':
        const currentLevel = await prisma.creatorLevel.findFirst({
          select: { level: true },
          where: {
            requiredPoints: {
              lte: await this.getTotalPoints(userId)
            }
          },
          orderBy: { level: 'desc' }
        });
        return { currentValue: currentLevel?.level || 1, targetValue: target };

      default:
        // Condition personnalisée non reconnue
        return { currentValue: 0, targetValue: target };
    }
  }

  /**
   * Obtenir tous les badges d'un utilisateur avec progression
   */
  async getUserBadgesWithProgress(userId: string): Promise<BadgeProgress[]> {
    const allBadges = await prisma.badge.findMany({
      select: {
        id: true
      },
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });

    return await Promise.all(
      allBadges.map(badge => this.getBadgeProgress(userId, badge.id))
    );
  }

  /**
   * Obtenir seulement les badges obtenus par l'utilisateur
   */
  async getEarnedBadges(userId: string): Promise<UserBadgeWithProgress[]> {
    const earnedBadges = await prisma.userBadge.findMany({
      where: { userId },
      select: {
        earnedAt: true,
        badge: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            iconUrl: true,
            color: true
          }
        }
      },
      orderBy: { earnedAt: 'desc' }
    });

    return earnedBadges.map(userBadge => ({
      badgeId: userBadge.badge.id,
      name: userBadge.badge.name,
      description: userBadge.badge.description,
      category: userBadge.badge.category,
      iconUrl: userBadge.badge.iconUrl,
      color: userBadge.badge.color,
      earnedAt: userBadge.earnedAt,
      progress: 100 // Toujours 100 pour les badges obtenus
    }));
  }

  /**
   * Vérifier et attribuer automatiquement les badges
   */
  async checkAndAwardBadges(userId: string): Promise<string[]> {
    const allBadges = await prisma.badge.findMany({
      select: {
        id: true,
        name: true,
        condition: true,
        targetValue: true,
        iconUrl: true
      },
      where: { isActive: true }
    });

    const newBadges: string[] = [];

    for (const badge of allBadges) {
      // Vérifier si l'utilisateur a déjà ce badge
      const existingBadge = await prisma.userBadge.findUnique({
        select: { id: true },
        where: {
          userId_badgeId: { userId, badgeId: badge.id }
        }
      });

      if (existingBadge) continue;

      // Calculer la progression
      const { currentValue, targetValue } =
        await this.calculateProgressByCondition(
          userId,
          badge.condition,
          badge.targetValue
        );

      // Si l'objectif est atteint, attribuer le badge
      if (currentValue >= targetValue) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
            earnedAt: new Date()
          }
        });

        newBadges.push(badge.id);

        // Créer une notification
        await prisma.notification.create({
          data: {
            userId,
            type: 'BADGE_EARNED',
            title: 'Nouveau badge !',
            message: `Félicitations ! Vous avez obtenu le badge "${badge.name}"`,
            imageUrl: badge.iconUrl,
            metadata: { badgeId: badge.id, badgeName: badge.name }
          }
        });
      }
    }

    return newBadges;
  }

  /**
   * Helper pour obtenir le total des points
   */
  private async getTotalPoints(userId: string): Promise<number> {
    const result = await prisma.pointsTransaction.aggregate({
      where: { userId, type: 'earned' },
      _sum: { amount: true }
    });
    return result._sum.amount || 0;
  }
}

export const creatorBadgeService = new CreatorBadgeService();
