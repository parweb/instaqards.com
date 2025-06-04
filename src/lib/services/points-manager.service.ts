import { PrismaClient } from '@prisma/client';
import { creatorBadgeService } from './creator-badge.service';

const prisma = new PrismaClient();

export interface PointsEvent {
  amount: number;
  source: string;
  description: string;
  metadata?: any;
}

export interface PointsStats {
  currentPoints: number;
  totalEarned: number;
  totalSpent: number;
  totalWithdrawn: number;
}

export class PointsManagerService {
  /**
   * UNIQUE méthode pour ajouter des points
   * Utilisée par TOUS les services
   */
  async addPoints(
    userId: string,
    amount: number,
    source: string,
    description: string,
    metadata?: any
  ): Promise<boolean> {
    try {
      // Créer la transaction de points
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

      // Vérifier et attribuer les badges automatiquement
      await creatorBadgeService.checkAndAwardBadges(userId);

      // Créer une notification
      await prisma.notification.create({
        data: {
          userId,
          type: 'POINTS_EARNED',
          title: 'Points gagnés !',
          message: `+${amount} points : ${description}`,
          metadata: { amount, source, ...metadata }
        }
      });

      return true;
    } catch (error) {
      console.error('Error adding points:', error);
      return false;
    }
  }

  /**
   * UNIQUE méthode pour retirer des points
   */
  async removePoints(
    userId: string,
    amount: number,
    source: string,
    description: string,
    metadata?: any
  ): Promise<boolean> {
    try {
      // Vérifier si l'utilisateur a assez de points
      const currentPoints = await this.getCurrentPoints(userId);
      if (currentPoints < amount) {
        throw new Error('Insufficient points');
      }

      // Créer la transaction de points
      await prisma.pointsTransaction.create({
        data: {
          userId,
          amount: -amount,
          type: 'spent',
          source,
          description,
          metadata
        }
      });

      return true;
    } catch (error) {
      console.error('Error removing points:', error);
      return false;
    }
  }

  /**
   * Ajouter des points pour une conversion
   */
  async addPointsForConversion(conversionData: {
    userId: string;
    conversionType: string;
    siteId?: string;
    clickId?: string;
    sourceUrl?: string;
    landingPage?: string;
  }): Promise<boolean> {
    try {
      // 1. Créer l'événement de conversion (sans points)
      const conversion = await prisma.conversionTracking.create({
        data: {
          creatorId: conversionData.userId,
          conversionType: conversionData.conversionType,
          siteId: conversionData.siteId,
          clickId: conversionData.clickId,
          sourceUrl: conversionData.sourceUrl,
          landingPage: conversionData.landingPage,
          convertedAt: new Date()
        }
      });

      // 2. Calculer les points selon le type de conversion
      const points = this.calculatePointsForConversion(
        conversionData.conversionType
      );

      // 3. Ajouter les points via le gestionnaire central
      await this.addPoints(
        conversionData.userId,
        points,
        'conversion',
        `Conversion ${conversionData.conversionType}`,
        {
          conversionId: conversion.id,
          conversionType: conversionData.conversionType,
          siteId: conversionData.siteId
        }
      );

      return true;
    } catch (error) {
      console.error('Error adding points for conversion:', error);
      return false;
    }
  }

  /**
   * Ajouter des points pour un partage social
   */
  async addPointsForSocialShare(shareData: {
    userId: string;
    platform: string;
    shareUrl: string;
    shareText?: string;
    siteId?: string;
  }): Promise<boolean> {
    try {
      // 1. Créer l'événement de partage (sans points)
      const share = await prisma.socialShareTracking.create({
        data: {
          creatorId: shareData.userId,
          platform: shareData.platform,
          shareUrl: shareData.shareUrl,
          shareText: shareData.shareText,
          siteId: shareData.siteId,
          sharedAt: new Date()
        }
      });

      // 2. Calculer les points selon la plateforme
      const points = this.calculatePointsForSocialShare(shareData.platform);

      // 3. Ajouter les points via le gestionnaire central
      await this.addPoints(
        shareData.userId,
        points,
        'social_share',
        `Partage ${shareData.platform}`,
        {
          shareId: share.id,
          platform: shareData.platform,
          siteId: shareData.siteId
        }
      );

      return true;
    } catch (error) {
      console.error('Error adding points for social share:', error);
      return false;
    }
  }

  /**
   * Ajouter des points pour un parrainage
   */
  async addPointsForReferral(referralData: {
    referrerId: string;
    referredEmail: string;
    referredName?: string;
    status: 'signed_up' | 'converted';
  }): Promise<boolean> {
    try {
      // 1. Mettre à jour l'événement de parrainage (sans points)
      await prisma.referralTracking.updateMany({
        where: {
          referrerId: referralData.referrerId,
          referredEmail: referralData.referredEmail
        },
        data: {
          status: referralData.status,
          ...(referralData.status === 'signed_up' && {
            signedUpAt: new Date()
          }),
          ...(referralData.status === 'converted' && {
            convertedAt: new Date()
          })
        }
      });

      // 2. Calculer les points selon le statut
      const points = this.calculatePointsForReferral(referralData.status);

      // 3. Ajouter les points via le gestionnaire central
      await this.addPoints(
        referralData.referrerId,
        points,
        'referral',
        `Parrainage ${referralData.status === 'signed_up' ? 'inscription' : 'conversion'}`,
        {
          referredEmail: referralData.referredEmail,
          status: referralData.status
        }
      );

      return true;
    } catch (error) {
      console.error('Error adding points for referral:', error);
      return false;
    }
  }

  /**
   * Obtenir les statistiques de points d'un utilisateur
   */
  async getPointsStats(userId: string): Promise<PointsStats> {
    const [earned, spent] = await Promise.all([
      prisma.pointsTransaction.aggregate({
        where: { userId, type: 'earned' },
        _sum: { amount: true }
      }),
      prisma.pointsTransaction.aggregate({
        where: { userId, type: 'spent' },
        _sum: { amount: true }
      })
    ]);

    const totalEarned = earned._sum.amount || 0;
    const totalSpent = Math.abs(spent._sum.amount || 0);
    const currentPoints = totalEarned - totalSpent;

    // Calculer les retraits depuis les transactions
    const withdrawn = await prisma.pointsTransaction.aggregate({
      where: {
        userId,
        type: 'spent',
        source: 'withdrawal'
      },
      _sum: { amount: true }
    });
    const totalWithdrawn = Math.abs(withdrawn._sum.amount || 0);

    return {
      currentPoints,
      totalEarned,
      totalSpent,
      totalWithdrawn
    };
  }

  /**
   * Obtenir les points actuels
   */
  async getCurrentPoints(userId: string): Promise<number> {
    const result = await prisma.pointsTransaction.aggregate({
      where: { userId },
      _sum: { amount: true }
    });
    return result._sum.amount || 0;
  }

  /**
   * Calculer les points pour une conversion selon le type
   */
  private calculatePointsForConversion(conversionType: string): number {
    const pointsMap: Record<string, number> = {
      lead: 100,
      sale: 500,
      signup: 50,
      contact: 25,
      download: 10
    };
    return pointsMap[conversionType] || 50;
  }

  /**
   * Calculer les points pour un partage selon la plateforme
   */
  private calculatePointsForSocialShare(platform: string): number {
    const pointsMap: Record<string, number> = {
      facebook: 15,
      linkedin: 20,
      twitter: 10,
      instagram: 15,
      whatsapp: 5
    };
    return pointsMap[platform] || 10;
  }

  /**
   * Calculer les points pour un parrainage selon le statut
   */
  private calculatePointsForReferral(status: string): number {
    const pointsMap: Record<string, number> = {
      signed_up: 50,
      converted: 200
    };
    return pointsMap[status] || 0;
  }

  /**
   * Obtenir l'historique des points d'un utilisateur
   */
  async getPointsHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<
    Array<{
      id: string;
      amount: number;
      type: string;
      source: string;
      description: string;
      metadata: any;
      createdAt: Date;
    }>
  > {
    const transactions = await prisma.pointsTransaction.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        type: true,
        source: true,
        description: true,
        metadata: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return transactions;
  }
}

export const pointsManagerService = new PointsManagerService();
