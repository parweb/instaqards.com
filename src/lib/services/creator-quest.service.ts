import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface QuestProgress {
  questId: string;
  questTitle: string;
  questType: string;
  difficulty: string;
  progress: number; // 0-100
  totalSteps: number;
  completedSteps: number;
  nextStep: {
    id: string;
    title: string;
    description: string;
  } | null;
  pointsReward: number;
  isCompleted: boolean;
  timeRemaining: number | null; // en heures
}

export interface QuestWithDetails {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  pointsReward: number;
  theme: string | null;
  endDate: Date | null;
  // isRecurring: boolean;
  // frequency: string | null;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    targetType: string | null;
    targetValue: number | null;
  }>;
}

export class CreatorQuestService {
  /**
   * Calculer la progression d'une quête pour un utilisateur
   */
  async getQuestProgress(userQuestId: string): Promise<number> {
    const userQuest = await prisma.userQuest.findUnique({
      where: { id: userQuestId },
      select: {
        steps: { select: { id: true, status: true } },
        quest: {
          select: { steps: true }
        }
      }
    });

    if (!userQuest) return 0;

    const totalSteps = userQuest.quest.steps.length;
    if (totalSteps === 0) return 0;

    const completedSteps = userQuest.steps.filter(
      step => step.status === 'COMPLETED'
    ).length;

    return (completedSteps / totalSteps) * 100;
  }

  /**
   * Obtenir les quêtes actives d'un Creator avec leur progression
   */
  async getActiveQuests(userId: string): Promise<QuestProgress[]> {
    const userQuests = await prisma.userQuest.findMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      select: {
        id: true,
        status: true,
        quest: {
          select: {
            id: true,
            title: true,
            type: true,
            difficulty: true,
            pointsReward: true,
            endDate: true,
            steps: {
              select: {
                id: true,
                title: true,
                description: true,
                order: true
              },
              orderBy: { order: 'asc' }
            }
          }
        },
        steps: {
          select: {
            stepId: true,
            status: true
          }
        }
      }
    });

    const questsProgress = await Promise.all(
      userQuests.map(async userQuest => {
        const totalSteps = userQuest.quest.steps.length;
        const completedSteps = userQuest.steps.filter(
          step => step.status === 'COMPLETED'
        ).length;

        const progress =
          totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

        // Trouver la prochaine étape non complétée
        const nextIncompleteStep = userQuest.quest.steps.find(step => {
          const userStep = userQuest.steps.find(us => us.stepId === step.id);
          return !userStep || userStep.status !== 'COMPLETED';
        });

        // Calculer le temps restant si il y a une limite
        let timeRemaining: number | null = null;
        if (userQuest.quest.endDate) {
          const now = new Date().getTime();
          const endTime = userQuest.quest.endDate.getTime();
          timeRemaining = Math.max(
            0,
            Math.floor((endTime - now) / (1000 * 60 * 60))
          ); // en heures
        }

        return {
          questId: userQuest.quest.id,
          questTitle: userQuest.quest.title,
          questType: userQuest.quest.type,
          difficulty: userQuest.quest.difficulty,
          progress,
          totalSteps,
          completedSteps,
          nextStep: nextIncompleteStep
            ? {
                id: nextIncompleteStep.id,
                title: nextIncompleteStep.title,
                description: nextIncompleteStep.description
              }
            : null,
          pointsReward: userQuest.quest.pointsReward,
          isCompleted: userQuest.status === 'COMPLETED',
          timeRemaining
        };
      })
    );

    return questsProgress;
  }

  /**
   * Obtenir les quêtes disponibles pour un Creator
   */
  async getAvailableQuests(userId: string): Promise<QuestWithDetails[]> {
    // Obtenir les quêtes auxquelles l'utilisateur ne participe pas encore
    const existingQuestIds = await prisma.userQuest
      .findMany({
        where: { userId },
        select: { questId: true }
      })
      .then(quests => quests.map(q => q.questId));

    const availableQuests = await prisma.quest.findMany({
      where: {
        status: 'ACTIVE',
        id: {
          notIn: existingQuestIds
        },
        OR: [
          { endDate: null }, // Pas de date limite
          { endDate: { gte: new Date() } } // Date limite non atteinte
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        difficulty: true,
        pointsReward: true,
        endDate:true,
        theme: true,
        steps: {
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
            targetType: true,
            targetValue: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
    });

    return availableQuests.map(quest => ({
      id: quest.id,
      title: quest.title,
      description: quest.description,
      type: quest.type,
      difficulty: quest.difficulty,
      pointsReward: quest.pointsReward,
      theme: quest.theme,
      endDate: quest.endDate,
      // isRecurring: quest.isRecurring,
      // frequency: quest.frequency,
      steps: quest.steps.map(step => ({
        id: step.id,
        title: step.title,
        description: step.description,
        order: step.order,
        targetType: step.targetType,
        targetValue: step.targetValue
      }))
    }));
  }

  /**
   * Démarrer une quête pour un Creator
   */
  async startQuest(userId: string, questId: string): Promise<boolean> {
    try {
      // Vérifier si la quête existe et est active
      const quest = await prisma.quest.findFirst({
        where: {
          id: questId,
          status: 'ACTIVE'
        },
        select: {
          id: true,
          steps: {
            select: {
              id: true
            }
          }
        }
      });

      if (!quest) return false;

      // Vérifier si l'utilisateur n'a pas déjà cette quête
      const existingUserQuest = await prisma.userQuest.findFirst({
        where: { userId, questId },
        select: {
          id: true
        }
      });

      if (existingUserQuest) return false;

      // Créer la participation à la quête
      await prisma.userQuest.create({
        data: {
          userId,
          questId,
          status: 'ACTIVE',
          steps: {
            create: quest.steps.map(step => ({
              stepId: step.id,
              status: 'PENDING'
            }))
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Error starting quest:', error);
      return false;
    }
  }

  /**
   * Marquer une étape comme complétée
   */
  async completeQuestStep(
    userQuestId: string,
    stepId: string,
    validationData?: any
  ): Promise<boolean> {
    try {
      await prisma.userQuestStep.updateMany({
        where: {
          userQuestId,
          stepId,
          status: { not: 'COMPLETED' }
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          validationData
        }
      });

      // Vérifier si toutes les étapes sont complétées
      const allSteps = await prisma.userQuestStep.findMany({
        where: { userQuestId },
        select: {
          status: true
        }
      });

      const allCompleted = allSteps.every(step => step.status === 'COMPLETED');

      if (allCompleted) {
        // Marquer la quête comme complétée
        await prisma.userQuest.update({
          where: { id: userQuestId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date()
          }
        });

        // Ajouter les points de récompense
        const userQuest = await prisma.userQuest.findUnique({
          where: { id: userQuestId },
          select: {
            userId: true,
            quest: {
              select: {
                id: true,
                title: true,
                pointsReward: true
              }
            }
          }
        });

        if (userQuest && userQuest.quest.pointsReward > 0) {
          await prisma.pointsTransaction.create({
            data: {
              userId: userQuest.userId,
              amount: userQuest.quest.pointsReward,
              type: 'earned',
              source: 'quest',
              description: `Quête complétée: ${userQuest.quest.title}`,
              metadata: {
                questId: userQuest.quest.id,
                questTitle: userQuest.quest.title
              }
            }
          });
        }
      }

      return true;
    } catch (error) {
      console.error('Error completing quest step:', error);
      return false;
    }
  }

  /**
   * Obtenir l'historique des quêtes complétées
   */
  async getCompletedQuests(userId: string): Promise<
    Array<{
      questTitle: string;
      pointsEarned: number;
      completedAt: Date;
      difficulty: string;
      type: string;
    }>
  > {
    const completedQuests = await prisma.userQuest.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { not: null }
      },
      select: {
        completedAt: true,
        quest: {
          select: {
            title: true,
            pointsReward: true,
            difficulty: true,
            type: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    return completedQuests.map(userQuest => ({
      questTitle: userQuest.quest.title,
      pointsEarned: userQuest.quest.pointsReward,
      completedAt: userQuest.completedAt!,
      difficulty: userQuest.quest.difficulty,
      type: userQuest.quest.type
    }));
  }
}

export const creatorQuestService = new CreatorQuestService();
