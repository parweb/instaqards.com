'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Target, 
  Trophy, 
  Clock, 
  CheckCircle, 
  Coins,
  Star,
  TrendingUp,
  Users,
  Heart,
  Eye,
  Calendar,
  Award,
  ArrowRight,
  Zap,
  DollarSign
} from 'lucide-react';

import { NotificationButton } from 'components/creator-notifications';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Progress } from 'components/ui/progress';

// Types
interface CreatorStats {
  followers: number;
  totalEarnings: number;
  totalPoints: number;
  completedQuests: number;
  activeQuests: number;
  engagementRate: number;
  monthlyViews: number;
  totalLikes: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: number;
  currency?: string;
  timeLeft?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

// Fake data
const mockStats: CreatorStats = {
  followers: 0, // Pas applicable pour les creators
  totalEarnings: 0, // Remplacé par les points
  totalPoints: 127, // Points gagnés en créant des sites
  completedQuests: 4, // Sites créés et validés
  activeQuests: 3, // Quêtes en cours
  engagementRate: 85, // Taux de validation admin
  monthlyViews: 2840, // Vues totales des sites créés
  totalLikes: 0 // Pas applicable
};

const mockActiveQuests: Quest[] = [
  {
    id: '1',
    title: 'Site Halloween 2024',
    description: 'Créez un site avec le thème Halloween selon les critères admin',
    progress: 2,
    maxProgress: 5,
    reward: 15,
    currency: 'points',
    timeLeft: 24,
    difficulty: 'medium'
  },
  {
    id: '2',
    title: 'Modification Site Lead - Coiffeur',
    description: 'Modernisez le site d\'un coiffeur prospect avec galerie et RDV',
    progress: 1,
    maxProgress: 6,
    reward: 18,
    currency: 'points',
    difficulty: 'medium'
  },
  {
    id: '3',
    title: 'Site Noël - Restaurant',
    description: 'Créez un site restaurant avec thème de Noël complet',
    progress: 0,
    maxProgress: 8,
    reward: 25,
    currency: 'points',
    timeLeft: 240,
    difficulty: 'hard'
  }
];

const mockRecentAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Premier site validé',
    description: 'Site Saint-Valentin approuvé par admin',
    icon: '🎯',
    rarity: 'common',
    unlockedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Partage social',
    description: 'Site partagé sur 3 réseaux sociaux',
    icon: '📱',
    rarity: 'rare',
    unlockedAt: new Date('2024-01-16')
  },
  {
    id: '3',
    title: 'Modification Lead',
    description: 'Premier site de prospect modifié',
    icon: '🔧',
    rarity: 'epic',
    unlockedAt: new Date('2024-01-18')
  }
];

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

const rarityColors = {
  common: 'bg-gray-100 text-gray-800',
  rare: 'bg-blue-100 text-blue-800',
  epic: 'bg-purple-100 text-purple-800',
  legendary: 'bg-yellow-100 text-yellow-800'
};

export function CreatorDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Welcome Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bienvenue dans votre espace Creator
            </h1>
            <p className="text-muted-foreground">
              Créez des sites selon les thèmes admin, partagez sur les réseaux sociaux et gagnez des points selon vos validations.
            </p>
          </div>
          <NotificationButton />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Sites créés</CardTitle>
            <Target className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.completedQuests}</div>
            <p className="text-xs opacity-75">
              sites validés par admin
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Points gagnés</CardTitle>
            <Star className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPoints}</div>
            <p className="text-xs opacity-75">
              +{mockStats.completedQuests} quêtes terminées
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Taux validation</CardTitle>
            <CheckCircle className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.engagementRate}%</div>
            <p className="text-xs opacity-75">
              sites approuvés par admin
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Vues totales</CardTitle>
            <Eye className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.monthlyViews.toLocaleString()}</div>
            <p className="text-xs opacity-75">
              sur tous vos sites
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Quests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Quêtes en cours
                  </CardTitle>
                  <CardDescription>
                    Terminez vos quêtes pour gagner des récompenses
                  </CardDescription>
                </div>
                <Link href="/app/affiliation">
                  <Button variant="outline" size="sm">
                    Voir toutes
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockActiveQuests.map(quest => (
                <div key={quest.id} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{quest.title}</h4>
                      <p className="text-sm text-muted-foreground">{quest.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={difficultyColors[quest.difficulty]}>
                        {quest.difficulty}
                      </Badge>
                      {quest.timeLeft && (
                        <Badge variant="outline" className="text-orange-600">
                          <Clock className="h-3 w-3 mr-1" />
                          {quest.timeLeft}h
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{quest.progress}/{quest.maxProgress}</span>
                    </div>
                    <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Coins className="h-4 w-4" />
                      <span>{quest.reward} {quest.currency}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Continuer
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/app/affiliation">
                <Button className="w-full justify-start" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Voir mes quêtes
                </Button>
              </Link>
              <Link href="/app/affiliation">
                <Button className="w-full justify-start" variant="outline">
                  <Trophy className="h-4 w-4 mr-2" />
                  Réclamer récompenses
                </Button>
              </Link>
              <Link href="/app/affiliation">
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Mon affiliation
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Succès récents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRecentAchievements.map(achievement => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <Badge className={rarityColors[achievement.rarity]}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      {achievement.unlockedAt.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Progression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Niveau Creator</span>
                  <span>Débutant (63%)</span>
                </div>
                <Progress value={63} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  73 points pour le niveau Confirmé
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{mockStats.completedQuests}</div>
                  <div className="text-xs text-muted-foreground">Sites validés</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{mockStats.activeQuests}</div>
                  <div className="text-xs text-muted-foreground">Quêtes actives</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 