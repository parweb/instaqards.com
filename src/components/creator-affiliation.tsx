'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Target, 
  Trophy, 
  Clock, 
  CheckCircle, 
  Lock, 
  Coins,
  Star,
  Users,
  TrendingUp,
  Share2,
  Eye,
  MousePointer,
  DollarSign,
  Award,
  Zap,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';

import { CreatorLevels } from 'components/creator-levels';
import { CreatorLeaderboard } from 'components/creator-leaderboard';
import { SocialShareTemplates } from 'components/social-share-templates';
import { CreatorAnalytics } from 'components/creator-analytics';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Progress } from 'components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

// Types
interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  conversionRate: number;
  sitesCreated: number;
  sitesShared: number;
  questsCompleted: number;
  currentPoints: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  progress: number;
  maxProgress: number;
  reward: {
    type: 'points' | 'commission_boost' | 'priority_access';
    amount: number;
    description: string;
  };
  timeLimit?: number;
  category: string;
  requirements: string[];
}

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'points' | 'commission_boost' | 'priority_access' | 'badge';
  value: number;
  status: 'available' | 'claimed' | 'locked';
  requirements: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  expiresAt?: Date;
  claimedAt?: Date;
}

// Fake data
const mockStats: AffiliateStats = {
  totalClicks: 1247,
  totalConversions: 23,
  totalEarnings: 345.50,
  conversionRate: 1.8,
  sitesCreated: 4,
  sitesShared: 4,
  questsCompleted: 3,
  currentPoints: 127
};

const mockQuests: Quest[] = [
  {
    id: '1',
    title: 'Site Halloween 2024',
    description: 'Créez un site Halloween et partagez-le pour convertir des prospects',
    difficulty: 'medium',
    status: 'in_progress',
    progress: 3,
    maxProgress: 5,
    reward: { 
      type: 'commission_boost', 
      amount: 20, 
      description: '+20% commission pendant 30 jours' 
    },
    category: 'Thème Saisonnier',
    timeLimit: 168,
    requirements: [
      '1 point: Créer le site avec template Halloween',
      '2 points: Compléter toutes les informations',
      '3 points: Partager sur 3 réseaux sociaux ✓',
      '4 points: Obtenir 10 clics sur vos liens',
      '5 points: Convertir 1 prospect en client'
    ]
  },
  {
    id: '2',
    title: 'Modification Site Lead - Coiffeur',
    description: 'Modernisez un site de prospect et convertissez-le en client',
    difficulty: 'medium',
    status: 'available',
    progress: 0,
    maxProgress: 6,
    reward: { 
      type: 'points', 
      amount: 50, 
      description: '50 points + commission double' 
    },
    category: 'Modification Lead',
    requirements: [
      '1 point: Analyser le site existant',
      '2 points: Refaire le design',
      '3 points: Ajouter galerie photos',
      '4 points: Partager sur réseaux sociaux',
      '5 points: Obtenir 20 clics',
      '6 points: Convertir le prospect'
    ]
  }
];

const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Boost Commission 20%',
    description: 'Augmentez vos commissions de 20% pendant 30 jours',
    type: 'commission_boost',
    value: 20,
    status: 'available',
    requirements: ['Compléter une quête de niveau medium'],
    rarity: 'rare'
  },
  {
    id: '2',
    title: 'Accès Prioritaire Quêtes',
    description: 'Accès en avant-première aux nouvelles quêtes',
    type: 'priority_access',
    value: 30,
    status: 'claimed',
    requirements: ['Atteindre 100 points'],
    rarity: 'epic',
    claimedAt: new Date('2024-01-15')
  }
];

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
};

const statusColors = {
  available: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  locked: 'bg-gray-100 text-gray-800 border-gray-200'
};

const rarityColors = {
  common: 'bg-gray-100 text-gray-800 border-gray-200',
  rare: 'bg-blue-100 text-blue-800 border-blue-200',
  epic: 'bg-purple-100 text-purple-800 border-purple-200',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

function QuestCard({ quest }: { quest: Quest }) {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <CardTitle className="text-lg">{quest.title}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge className={difficultyColors[quest.difficulty]}>
              {quest.difficulty}
            </Badge>
            <Badge className={statusColors[quest.status]}>
              {quest.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm">
          {quest.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{quest.progress}/{quest.maxProgress}</span>
          </div>
          <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2" />
        </div>

        {/* Reward */}
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <Trophy className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">
            {quest.reward.description}
          </span>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-600">Étapes de conversion:</span>
          <ul className="text-sm space-y-1">
            {quest.requirements.map((req, index) => {
              const isCompleted = index < quest.progress;
              const isCurrentStep = index === quest.progress;
              
              return (
                <li key={index} className={`flex items-center gap-2 p-2 rounded ${
                  isCompleted ? 'bg-green-50 text-green-700' :
                  isCurrentStep ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : isCurrentStep ? (
                    <Clock className="h-3 w-3 text-blue-600" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
                  )}
                  {req}
                </li>
              );
            })}
          </ul>
        </div>

        <Button className="w-full" disabled={quest.status === 'locked' || quest.status === 'completed'}>
          {quest.status === 'completed' && 'Terminé'}
          {quest.status === 'in_progress' && 'Continuer'}
          {quest.status === 'available' && 'Commencer'}
          {quest.status === 'locked' && 'Verrouillé'}
        </Button>
      </CardContent>
    </Card>
  );
}

function RewardCard({ reward }: { reward: Reward }) {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            <CardTitle className="text-lg">{reward.title}</CardTitle>
          </div>
          <Badge className={rarityColors[reward.rarity]}>
            {reward.rarity}
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {reward.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {reward.claimedAt && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Réclamé le {reward.claimedAt.toLocaleDateString('fr-FR')}</span>
          </div>
        )}

        <Button 
          className="w-full" 
          disabled={reward.status === 'locked' || reward.status === 'claimed'}
          variant={reward.status === 'claimed' ? 'outline' : 'default'}
        >
          {reward.status === 'claimed' && 'Réclamé'}
          {reward.status === 'available' && 'Réclamer'}
          {reward.status === 'locked' && 'Verrouillé'}
        </Button>
      </CardContent>
    </Card>
  );
}

export function CreatorAffiliation() {
  const [activeTab, setActiveTab] = useState('overview');
  const affiliateLink = "https://qards.link/?r=creator123";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Affiliation Creator</h1>
        <p className="text-muted-foreground">
          Créez des sites, partagez-les sur les réseaux sociaux et gagnez des commissions sur chaque conversion. 
          Complétez des quêtes pour booster vos gains !
        </p>
      </div>

      {/* Affiliate Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Votre lien d'affiliation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm">
              {affiliateLink}
            </div>
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clics totaux</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              via vos partages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.conversionRate}% taux de conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gains totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalEarnings}€</div>
            <p className="text-xs text-muted-foreground">
              commissions gagnées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points bonus</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.currentPoints}</div>
            <p className="text-xs text-muted-foreground">
              via les quêtes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="quests">Quêtes</TabsTrigger>
          <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          <TabsTrigger value="levels">Niveaux</TabsTrigger>
          <TabsTrigger value="leaderboard">Classement</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance d'affiliation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sites créés</span>
                  <span className="font-bold">{mockStats.sitesCreated}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sites partagés</span>
                  <span className="font-bold">{mockStats.sitesShared}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quêtes complétées</span>
                  <span className="font-bold">{mockStats.questsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux de conversion</span>
                  <span className="font-bold text-green-600">{mockStats.conversionRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prochaines étapes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Terminer quête Halloween</div>
                    <div className="text-sm text-muted-foreground">2 étapes restantes</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Share2 className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Partager sur LinkedIn</div>
                    <div className="text-sm text-muted-foreground">Augmentez votre portée</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quests" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRewards.map(reward => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="levels" className="mt-6">
          <CreatorLevels currentPoints={mockStats.currentPoints} />
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <CreatorLeaderboard period="month" />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <SocialShareTemplates />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CreatorAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
} 