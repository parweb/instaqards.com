'use client';

import { useState } from 'react';
import { 
  Trophy, 
  Coins, 
  Star, 
  Gift, 
  Calendar,
  CheckCircle,
  Clock,
  Lock,
  TrendingUp,
  Award,
  Crown,
  Zap
} from 'lucide-react';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

// Types pour les récompenses
type RewardType = 'money' | 'points' | 'badge' | 'unlock' | 'boost';
type RewardStatus = 'available' | 'claimed' | 'locked';

interface Reward {
  id: string;
  title: string;
  description: string;
  type: RewardType;
  value: number;
  currency?: string;
  status: RewardStatus;
  requirements: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  expiresAt?: Date;
  claimedAt?: Date;
}

// Fake data pour les récompenses
const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Bonus de bienvenue',
    description: 'Récompense pour avoir complété votre premier profil',
    type: 'money',
    value: 10,
    currency: 'EUR',
    status: 'claimed',
    requirements: ['Compléter le profil'],
    rarity: 'common',
    claimedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Points de démarrage',
    description: 'Points bonus pour vos premières actions',
    type: 'points',
    value: 100,
    status: 'claimed',
    requirements: ['Première publication'],
    rarity: 'common',
    claimedAt: new Date('2024-01-16')
  },
  {
    id: '3',
    title: 'Badge Créateur Actif',
    description: 'Badge spécial pour les créateurs réguliers',
    type: 'badge',
    value: 1,
    status: 'available',
    requirements: ['Publier 5 contenus'],
    rarity: 'rare'
  },
  {
    id: '4',
    title: 'Boost de visibilité',
    description: 'Augmente la portée de vos prochaines publications',
    type: 'boost',
    value: 24,
    status: 'available',
    requirements: ['Atteindre 100 likes'],
    rarity: 'epic',
    expiresAt: new Date('2024-02-01')
  },
  {
    id: '5',
    title: 'Bonus Influenceur',
    description: 'Récompense exclusive pour les top créateurs',
    type: 'money',
    value: 100,
    currency: 'EUR',
    status: 'locked',
    requirements: ['Atteindre 1000 abonnés', 'Maintenir un taux d\'engagement > 5%'],
    rarity: 'legendary'
  },
  {
    id: '6',
    title: 'Accès Premium',
    description: 'Débloquez des fonctionnalités avancées',
    type: 'unlock',
    value: 30,
    status: 'locked',
    requirements: ['Être dans le top 10 du mois'],
    rarity: 'epic'
  },
  {
    id: '7',
    title: 'Bonus collaboration',
    description: 'Récompense pour votre première collaboration',
    type: 'money',
    value: 25,
    currency: 'EUR',
    status: 'available',
    requirements: ['Compléter une collaboration'],
    rarity: 'rare',
    expiresAt: new Date('2024-01-30')
  }
];

const rarityColors = {
  common: 'bg-gray-100 text-gray-800 border-gray-200',
  rare: 'bg-blue-100 text-blue-800 border-blue-200',
  epic: 'bg-purple-100 text-purple-800 border-purple-200',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const statusColors = {
  available: 'bg-green-100 text-green-800 border-green-200',
  claimed: 'bg-gray-100 text-gray-800 border-gray-200',
  locked: 'bg-red-100 text-red-800 border-red-200'
};

const typeIcons = {
  money: Coins,
  points: Star,
  badge: Award,
  unlock: Lock,
  boost: Zap
};

function RewardCard({ reward }: { reward: Reward }) {
  const TypeIcon = typeIcons[reward.type];
  const isExpiringSoon = reward.expiresAt && 
    new Date(reward.expiresAt).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      reward.status === 'locked' ? 'opacity-60' : 'hover:scale-[1.02]'
    } ${reward.rarity === 'legendary' ? 'ring-2 ring-yellow-300' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5" />
            <CardTitle className="text-lg">{reward.title}</CardTitle>
            {reward.rarity === 'legendary' && <Crown className="h-4 w-4 text-yellow-500" />}
          </div>
          <div className="flex gap-2">
            <Badge className={rarityColors[reward.rarity]}>
              {reward.rarity}
            </Badge>
            <Badge className={statusColors[reward.status]}>
              {reward.status === 'claimed' ? 'réclamé' : reward.status === 'locked' ? 'verrouillé' : 'disponible'}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm">
          {reward.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Value */}
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <TypeIcon className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">
            {reward.type === 'money' && `${reward.value} ${reward.currency}`}
            {reward.type === 'points' && `${reward.value} points`}
            {reward.type === 'badge' && 'Badge exclusif'}
            {reward.type === 'unlock' && `Accès ${reward.value} jours`}
            {reward.type === 'boost' && `Boost ${reward.value}h`}
          </span>
        </div>

        {/* Expiration warning */}
        {isExpiringSoon && reward.status === 'available' && (
          <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700">
              Expire bientôt !
            </span>
          </div>
        )}

        {/* Claimed date */}
        {reward.claimedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle className="h-4 w-4" />
            <span>Réclamé le {reward.claimedAt.toLocaleDateString('fr-FR')}</span>
          </div>
        )}

        {/* Requirements */}
        {reward.status === 'locked' && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-600">Prérequis:</span>
            <ul className="text-sm text-gray-500 space-y-1">
              {reward.requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action button */}
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

export default function RewardsPage() {
  const [selectedType, setSelectedType] = useState('all');
  
  const types = ['all', 'money', 'points', 'badge', 'unlock', 'boost'];
  
  const filteredRewards = selectedType === 'all' 
    ? mockRewards 
    : mockRewards.filter(r => r.type === selectedType);

  const stats = {
    totalClaimed: mockRewards.filter(r => r.status === 'claimed').length,
    totalAvailable: mockRewards.filter(r => r.status === 'available').length,
    totalEarned: mockRewards
      .filter(r => r.status === 'claimed' && r.type === 'money')
      .reduce((sum, r) => sum + r.value, 0),
    totalPoints: mockRewards
      .filter(r => r.status === 'claimed' && r.type === 'points')
      .reduce((sum, r) => sum + r.value, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Récompenses</h1>
        <p className="text-muted-foreground">
          Réclamez vos récompenses gagnées en accomplissant des quêtes et en atteignant vos objectifs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réclamées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClaimed}</div>
            <p className="text-xs text-muted-foreground">
              récompenses obtenues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Gift className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAvailable}</div>
            <p className="text-xs text-muted-foreground">
              à réclamer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gains totaux</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEarned}€</div>
            <p className="text-xs text-muted-foreground">
              réclamés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              points gagnés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="grid w-full grid-cols-6">
          {types.map(type => (
            <TabsTrigger key={type} value={type} className="capitalize">
              {type === 'all' ? 'Toutes' : 
               type === 'money' ? 'Argent' :
               type === 'points' ? 'Points' :
               type === 'badge' ? 'Badges' :
               type === 'unlock' ? 'Accès' : 'Boost'}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedType} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map(reward => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 