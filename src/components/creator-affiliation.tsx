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
  ExternalLink,
  Flame,
  Crown,
  Gem,
  Sparkles,
  Rocket,
  Shield
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
    title: '🎃 Site Halloween 2024',
    description: 'Créez un site Halloween et partagez-le pour convertir des prospects',
    difficulty: 'medium',
    status: 'in_progress',
    progress: 3,
    maxProgress: 5,
    reward: { 
      type: 'commission_boost', 
      amount: 20, 
      description: '🔥 +20% commission pendant 30 jours' 
    },
    category: 'Thème Saisonnier',
    timeLimit: 168,
    requirements: [
      '🎨 1 point: Créer le site avec template Halloween',
      '📝 2 points: Compléter toutes les informations',
      '📱 3 points: Partager sur 3 réseaux sociaux ✓',
      '👆 4 points: Obtenir 10 clics sur vos liens',
      '💰 5 points: Convertir 1 prospect en client'
    ]
  },
  {
    id: '2',
    title: '✂️ Modification Site Lead - Coiffeur',
    description: 'Modernisez un site de prospect et convertissez-le en client',
    difficulty: 'medium',
    status: 'available',
    progress: 0,
    maxProgress: 6,
    reward: { 
      type: 'points', 
      amount: 50, 
      description: '⭐ 50 points + commission double' 
    },
    category: 'Modification Lead',
    requirements: [
      '🔍 1 point: Analyser le site existant',
      '🎨 2 points: Refaire le design',
      '📸 3 points: Ajouter galerie photos',
      '📱 4 points: Partager sur réseaux sociaux',
      '👆 5 points: Obtenir 20 clics',
      '💰 6 points: Convertir le prospect'
    ]
  }
];

const mockRewards: Reward[] = [
  {
    id: '1',
    title: '🔥 Boost Commission 20%',
    description: 'Augmentez vos commissions de 20% pendant 30 jours',
    type: 'commission_boost',
    value: 20,
    status: 'available',
    requirements: ['Compléter une quête de niveau medium'],
    rarity: 'rare'
  },
  {
    id: '2',
    title: '⚡ Accès Prioritaire Quêtes',
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
  easy: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg shadow-green-200',
  medium: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg shadow-yellow-200',
  hard: 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg shadow-red-200'
};

const statusColors = {
  available: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-200',
  in_progress: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg shadow-orange-200',
  completed: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg shadow-green-200',
  locked: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg shadow-gray-200'
};

const rarityColors = {
  common: 'bg-gradient-to-r from-gray-400 to-slate-500 text-white border-0 shadow-lg shadow-gray-200',
  rare: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg shadow-blue-200',
  epic: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-lg shadow-purple-200',
  legendary: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 shadow-lg shadow-yellow-200'
};

function QuestCard({ quest }: { quest: Quest }) {
  const isActive = quest.status === 'in_progress';
  const isCompleted = quest.status === 'completed';
  
  return (
    <Card className={`
      transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden
      ${isActive ? 'ring-4 ring-blue-400 ring-opacity-50 shadow-2xl shadow-blue-200' : ''}
      ${isCompleted ? 'ring-4 ring-green-400 ring-opacity-50 shadow-2xl shadow-green-200' : ''}
      bg-gradient-to-br from-white via-blue-50 to-purple-50
    `}>
      {/* Animated background effect */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-pulse" />
      )}
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {quest.title}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge className={`${difficultyColors[quest.difficulty]} animate-pulse`}>
              {quest.difficulty === 'easy' && '⭐'}
              {quest.difficulty === 'medium' && '⭐⭐'}
              {quest.difficulty === 'hard' && '⭐⭐⭐'}
              {quest.difficulty}
            </Badge>
            <Badge className={statusColors[quest.status]}>
              {quest.status === 'available' && '🎯'}
              {quest.status === 'in_progress' && '⚡'}
              {quest.status === 'completed' && '✅'}
              {quest.status === 'locked' && '🔒'}
              {quest.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-600">
          {quest.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {/* Progress with glow effect */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              Progression
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
              {quest.progress}/{quest.maxProgress}
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={(quest.progress / quest.maxProgress) * 100} 
              className="h-3 bg-gray-200 shadow-inner"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse" />
          </div>
        </div>

        {/* Reward with sparkle effect */}
        <div className="relative p-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 rounded-xl border-2 border-gradient-to-r from-yellow-200 to-orange-300 shadow-lg">
          <div className="absolute top-1 right-1">
            <Sparkles className="h-4 w-4 text-yellow-500 animate-spin" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {quest.reward.description}
            </span>
          </div>
        </div>

        {/* Requirements with colorful steps */}
        <div className="space-y-3">
          <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            Étapes de conversion:
          </span>
          <ul className="space-y-2">
            {quest.requirements.map((req, index) => {
              const isCompleted = index < quest.progress;
              const isCurrentStep = index === quest.progress;
              
              return (
                <li key={index} className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-300 transform
                  ${isCompleted ? 
                    'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-lg scale-105' :
                    isCurrentStep ? 
                    'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 shadow-lg ring-2 ring-blue-300 animate-pulse' : 
                    'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 hover:shadow-md'
                  }
                `}>
                  <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300
                    ${isCompleted ? 
                      'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg' :
                      isCurrentStep ? 
                      'bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg animate-pulse' : 
                      'bg-gradient-to-r from-gray-300 to-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : isCurrentStep ? (
                      <Clock className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{req}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <Button 
          className={`
            w-full transition-all duration-300 transform hover:scale-105 shadow-lg
            ${quest.status === 'completed' ? 
              'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-200' :
              quest.status === 'in_progress' ? 
              'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-200 animate-pulse' :
              quest.status === 'available' ? 
              'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-orange-200' :
              'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
            }
          `}
          disabled={quest.status === 'locked' || quest.status === 'completed'}
        >
          <div className="flex items-center gap-2">
            {quest.status === 'completed' && <><Trophy className="h-4 w-4" /> Terminé</>}
            {quest.status === 'in_progress' && <><Rocket className="h-4 w-4" /> Continuer</>}
            {quest.status === 'available' && <><Flame className="h-4 w-4" /> Commencer</>}
            {quest.status === 'locked' && <><Lock className="h-4 w-4" /> Verrouillé</>}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}

function RewardCard({ reward }: { reward: Reward }) {
  const isClaimed = reward.status === 'claimed';
  
  return (
    <Card className={`
      transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden
      ${isClaimed ? 'ring-4 ring-green-400 ring-opacity-50 shadow-2xl shadow-green-200' : ''}
      bg-gradient-to-br from-white via-purple-50 to-pink-50
    `}>
      {/* Rarity glow effect */}
      <div className={`absolute inset-0 opacity-20 ${
        reward.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 animate-pulse' :
        reward.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-violet-600 animate-pulse' :
        reward.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
        'bg-gradient-to-r from-gray-400 to-slate-500'
      }`} />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full shadow-lg ${
              reward.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
              reward.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
              reward.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
              'bg-gradient-to-r from-gray-400 to-slate-500'
            }`}>
              {reward.rarity === 'legendary' && <Crown className="h-5 w-5 text-white" />}
              {reward.rarity === 'epic' && <Gem className="h-5 w-5 text-white" />}
              {reward.rarity === 'rare' && <Star className="h-5 w-5 text-white" />}
              {reward.rarity === 'common' && <Award className="h-5 w-5 text-white" />}
            </div>
            <CardTitle className="text-lg bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {reward.title}
            </CardTitle>
          </div>
          <Badge className={`${rarityColors[reward.rarity]} animate-pulse`}>
            {reward.rarity === 'legendary' && '👑'}
            {reward.rarity === 'epic' && '💎'}
            {reward.rarity === 'rare' && '⭐'}
            {reward.rarity === 'common' && '🏅'}
            {reward.rarity}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600">
          {reward.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {reward.claimedAt && (
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200 shadow-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-bold text-green-800">
              🎉 Réclamé le {reward.claimedAt.toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}

        <Button 
          className={`
            w-full transition-all duration-300 transform hover:scale-105 shadow-lg
            ${reward.status === 'claimed' ? 
              'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-200' :
              reward.status === 'available' ? 
              'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-purple-200 animate-pulse' :
              'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
            }
          `}
          disabled={reward.status === 'locked' || reward.status === 'claimed'}
          variant={reward.status === 'claimed' ? 'outline' : 'default'}
        >
          <div className="flex items-center gap-2">
            {reward.status === 'claimed' && <><Trophy className="h-4 w-4" /> Réclamé</>}
            {reward.status === 'available' && <><Sparkles className="h-4 w-4" /> Réclamer</>}
            {reward.status === 'locked' && <><Lock className="h-4 w-4" /> Verrouillé</>}
          </div>
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Animated Header */}
      <div className="space-y-4 text-center">
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            🎮 Creator Gaming Hub 🎮
          </h1>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-8 w-8 text-yellow-500 animate-spin" />
          </div>
        </div>
        <p className="text-lg text-gray-600 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          🚀 Créez des sites, partagez-les sur les réseaux sociaux et gagnez des commissions sur chaque conversion. 
          Complétez des quêtes épiques pour booster vos gains ! ⚡
        </p>
      </div>

      {/* Affiliate Link with glow effect */}
      <Card className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-1 shadow-2xl">
        <div className="bg-white rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🔗 Votre lien d'affiliation magique
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl font-mono text-sm border-2 border-blue-200 shadow-inner">
                {affiliateLink}
              </div>
              <Button 
                onClick={copyToClipboard} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-300"
                size="sm"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg transform hover:scale-105 transition-all duration-300"
                size="sm"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Gaming Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-2xl shadow-blue-200 transform hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🎯 Clics totaux</CardTitle>
            <MousePointer className="h-6 w-6 animate-bounce" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockStats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-blue-100">
              via vos partages épiques
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-200 transform hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">⚡ Conversions</CardTitle>
            <Users className="h-6 w-6 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockStats.totalConversions}</div>
            <p className="text-xs text-green-100">
              {mockStats.conversionRate}% taux de conversion
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-2xl shadow-yellow-200 transform hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">💰 Gains totaux</CardTitle>
            <DollarSign className="h-6 w-6 animate-spin" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockStats.totalEarnings}€</div>
            <p className="text-xs text-yellow-100">
              commissions gagnées
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-200 transform hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">⭐ Points bonus</CardTitle>
            <Star className="h-6 w-6 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockStats.currentPoints}</div>
            <p className="text-xs text-purple-100">
              via les quêtes épiques
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gaming Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-1 shadow-2xl">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg transition-all duration-300">
            🏠 Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="quests" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg transition-all duration-300">
            🎯 Quêtes
          </TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg transition-all duration-300">
            🏆 Récompenses
          </TabsTrigger>
          <TabsTrigger value="levels" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg transition-all duration-300">
            📈 Niveaux
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg transition-all duration-300">
            👑 Classement
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg transition-all duration-300">
            📱 Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg transition-all duration-300">
            📊 Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    🎮 Performance Gaming
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <span className="font-medium">🎨 Sites créés</span>
                  <span className="font-bold text-blue-600">{mockStats.sitesCreated}</span>
                </div>
                <div className="flex justify-between p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <span className="font-medium">📱 Sites partagés</span>
                  <span className="font-bold text-green-600">{mockStats.sitesShared}</span>
                </div>
                <div className="flex justify-between p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                  <span className="font-medium">🏆 Quêtes complétées</span>
                  <span className="font-bold text-orange-600">{mockStats.questsCompleted}</span>
                </div>
                <div className="flex justify-between p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <span className="font-medium">⚡ Taux de conversion</span>
                  <span className="font-bold text-purple-600">{mockStats.conversionRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white via-green-50 to-blue-50 shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Rocket className="h-6 w-6 text-green-600" />
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    🚀 Prochaines missions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-blue-800">🎃 Terminer quête Halloween</div>
                    <div className="text-sm text-blue-600">2 étapes restantes pour la victoire !</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-green-800">📱 Partager sur LinkedIn</div>
                    <div className="text-sm text-green-600">Augmentez votre portée épique !</div>
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