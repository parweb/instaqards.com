import { PrismaClient } from '@prisma/client';
import { startOfWeek } from 'date-fns';

const prisma = new PrismaClient();

export interface CreatorDashboard {
  // Points (calculés)
  currentPoints: number;
  totalEarned: number;
  totalWithdrawn: number;

  // Niveau (calculé)
  currentLevel: {
    id: string;
    level: number;
    name: string;
    color: string;
  } | null;
  levelProgress: number;
  pointsToNextLevel: number;

  // Métriques (calculées)
  weeklyStats: {
    conversions: number;
    points: number;
    shares: number;
    sites: number;
  };

  // Quêtes (calculées)
  activeQuests: Array<{
    id: string;
    title: string;
    progress: number;
    pointsReward: number;
  }>;

  // Classement (calculé)
  leaderboardRank: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalPoints: number;
  rank: number;
}

export class CreatorService {
  /**
   * Calculer les points actuels
   */
  async getCurrentPoints(userId: string): Promise<number> {
    const result = await prisma.pointsTransaction.aggregate({
      where: { userId },
      _sum: { amount: true }
    });
    return result._sum.amount || 0;
  }

  /**
   * Calculer le total gagné
   */
  async getTotalEarned(userId: string): Promise<number> {
    const result = await prisma.pointsTransaction.aggregate({
      where: { userId, type: 'earned' },
      _sum: { amount: true }
    });
    return result._sum.amount || 0;
  }

  /**
   * Calculer le total retiré (approximatif depuis les transactions)
   */
  async getTotalWithdrawn(userId: string): Promise<number> {
    const result = await prisma.pointsTransaction.aggregate({
      where: {
        userId,
        type: 'spent',
        source: 'withdrawal'
      },
      _sum: { amount: true }
    });
    return Math.abs(result._sum.amount || 0);
  }

  /**
   * Calculer le niveau actuel
   */
  async getCurrentLevel(userId: string) {
    const totalPoints = await this.getTotalEarned(userId);

    return await prisma.creatorLevel.findFirst({
      where: { requiredPoints: { lte: totalPoints } },
      select: {
        id: true,
        level: true,
        name: true,
        color: true,
        requiredPoints: true
      },
      orderBy: { level: 'desc' }
    });
  }

  /**
   * Calculer la progression vers le niveau suivant
   */
  async getLevelProgress(
    userId: string
  ): Promise<{ progress: number; pointsToNext: number }> {
    const totalPoints = await this.getTotalEarned(userId);
    const currentLevel = await this.getCurrentLevel(userId);

    if (!currentLevel) {
      return { progress: 0, pointsToNext: 0 };
    }

    const nextLevel = await prisma.creatorLevel.findFirst({
      where: { level: currentLevel.level + 1 },
      select: {
        requiredPoints: true
      }
    });

    if (!nextLevel) {
      return { progress: 100, pointsToNext: 0 };
    }

    const pointsInLevel = totalPoints - currentLevel.requiredPoints;
    const pointsNeeded = nextLevel.requiredPoints - currentLevel.requiredPoints;
    const progress = Math.min((pointsInLevel / pointsNeeded) * 100, 100);
    const pointsToNext = Math.max(nextLevel.requiredPoints - totalPoints, 0);

    return { progress, pointsToNext };
  }

  /**
   * Calculer les stats hebdomadaires
   */
  async getWeeklyStats(userId: string) {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    const [conversions, points, shares, sites] = await Promise.all([
      prisma.conversionTracking.count({
        where: { creatorId: userId, convertedAt: { gte: weekStart } }
      }),
      prisma.pointsTransaction.aggregate({
        where: { userId, type: 'earned', createdAt: { gte: weekStart } },
        _sum: { amount: true }
      }),
      prisma.socialShareTracking.count({
        where: { creatorId: userId, sharedAt: { gte: weekStart } }
      }),
      prisma.site.count({
        where: { userId, createdAt: { gte: weekStart } }
      })
    ]);

    return {
      conversions,
      points: points._sum.amount || 0,
      shares,
      sites
    };
  }

  /**
   * Calculer la progression des quêtes actives
   */
  async getActiveQuests(userId: string) {
    const userQuests = await prisma.userQuest.findMany({
      where: { userId, status: 'ACTIVE' },
      select: {
        id: true,
        quest: {
          select: {
            title: true,
            pointsReward: true,
            steps: {
              select: {
                id: true
              }
            }
          }
        },
        steps: {
          select: {
            status: true
          }
        }
      }
    });

    return userQuests.map(userQuest => {
      const totalSteps = userQuest.quest.steps.length;
      const completedSteps = userQuest.steps.filter(
        step => step.status === 'COMPLETED'
      ).length;

      const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

      return {
        id: userQuest.id,
        title: userQuest.quest.title,
        progress,
        pointsReward: userQuest.quest.pointsReward
      };
    });
  }

  /**
   * Calculer le classement simple
   */
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    // Requête simplifiée sans SQL brut
    const creators = await prisma.user.findMany({
      where: { role: 'CREATOR' },
      select: {
        id: true,
        name: true,
        pointsTransactions: {
          where: { type: 'earned' },
          select: {
            amount: true
          }
        }
      }
    });

    // Calculer les points et trier
    const creatorsWithPoints = creators.map(creator => {
      const totalPoints = creator.pointsTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
      return {
        userId: creator.id,
        userName: creator.name || 'Creator',
        totalPoints
      };
    });

    // Trier par points et ajouter le rang
    creatorsWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);

    return creatorsWithPoints.slice(0, limit).map((creator, index) => ({
      ...creator,
      rank: index + 1
    }));
  }

  /**
   * Obtenir le dashboard complet d'un Creator
   */
  async getCreatorDashboard(userId: string): Promise<CreatorDashboard> {
    const [
      currentPoints,
      totalEarned,
      totalWithdrawn,
      currentLevel,
      levelProgress,
      weeklyStats,
      activeQuests,
      leaderboard
    ] = await Promise.all([
      this.getCurrentPoints(userId),
      this.getTotalEarned(userId),
      this.getTotalWithdrawn(userId),
      this.getCurrentLevel(userId),
      this.getLevelProgress(userId),
      this.getWeeklyStats(userId),
      this.getActiveQuests(userId),
      this.getLeaderboard(50)
    ]);

    // Trouver le rang du Creator dans le leaderboard
    const userRank =
      leaderboard.findIndex(entry => entry.userId === userId) + 1;

    return {
      currentPoints,
      totalEarned,
      totalWithdrawn,
      currentLevel: currentLevel
        ? {
            id: currentLevel.id,
            level: currentLevel.level,
            name: currentLevel.name,
            color: currentLevel.color
          }
        : null,
      levelProgress: levelProgress.progress,
      pointsToNextLevel: levelProgress.pointsToNext,
      weeklyStats,
      activeQuests,
      leaderboardRank: userRank || 999
    };
  }

  /**
   * Ajouter des points à un Creator
   */
  async addPoints(
    userId: string,
    amount: number,
    source: string,
    description: string,
    metadata?: any
  ): Promise<boolean> {
    try {
      await prisma.pointsTransaction.create({
        data: {
          userId,
          amount,
          type: 'earned',
          source,
          description,
          metadata
        }
      });
      return true;
    } catch (error) {
      console.error('Error adding points:', error);
      return false;
    }
  }

  /**
   * Simuler un retrait de points (sans le modèle Withdrawal pour l'instant)
   */
  async withdrawPoints(
    userId: string,
    pointsAmount: number,
    description: string = 'Retrait de points'
  ): Promise<boolean> {
    try {
      await prisma.pointsTransaction.create({
        data: {
          userId,
          amount: -pointsAmount,
          type: 'spent',
          source: 'withdrawal',
          description
        }
      });
      return true;
    } catch (error) {
      console.error('Error withdrawing points:', error);
      return false;
    }
  }
}

export const creatorService = new CreatorService();
