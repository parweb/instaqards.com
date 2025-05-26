'use client';

import { useState } from 'react';
import { 
  Target, 
  Trophy, 
  Clock, 
  CheckCircle, 
  Lock, 
  Coins,
  Star,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Progress } from 'components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

// Types pour les quêtes
type QuestStatus = 'available' | 'in_progress' | 'completed' | 'locked';
type QuestDifficulty = 'easy' | 'medium' | 'hard';
type RewardType = 'money' | 'points' | 'badge';

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  progress: number;
  maxProgress: number;
  reward: {
    type: RewardType;
    amount: number;
    currency?: string;
  };
  timeLimit?: number; // en heures
  category: string;
  requirements?: string[];
}

// Fake data pour les quêtes
const mockQuests: Quest[] = [
  {
    id: '1',
    title: 'Premier pas',
    description: 'Complétez votre profil créateur en ajoutant une photo et une bio',
    difficulty: 'easy',
    status: 'completed',
    progress: 100,
    maxProgress: 100,
    reward: { type: 'points', amount: 50 },
    category: 'Onboarding'
  },
  {
    id: '2',
    title: 'Créateur actif',
    description: 'Publiez votre premier contenu sur la plateforme',
    difficulty: 'easy',
    status: 'in_progress',
    progress: 75,
    maxProgress: 100,
    reward: { type: 'money', amount: 10, currency: 'EUR' },
    timeLimit: 24,
    category: 'Création'
  },
  {
    id: '3',
    title: 'Engagement communautaire',
    description: 'Obtenez 100 likes sur vos contenus',
    difficulty: 'medium',
    status: 'in_progress',
    progress: 45,
    maxProgress: 100,
    reward: { type: 'money', amount: 25, currency: 'EUR' },
    category: 'Engagement'
  },
  {
    id: '4',
    title: 'Influenceur montant',
    description: 'Atteignez 1000 abonnés',
    difficulty: 'hard',
    status: 'available',
    progress: 0,
    maxProgress: 1000,
    reward: { type: 'money', amount: 100, currency: 'EUR' },
    category: 'Croissance',
    requirements: ['Avoir complété "Engagement communautaire"']
  },
  {
    id: '5',
    title: 'Collaborateur',
    description: 'Participez à 3 collaborations avec d\'autres créateurs',
    difficulty: 'medium',
    status: 'locked',
    progress: 0,
    maxProgress: 3,
    reward: { type: 'money', amount: 50, currency: 'EUR' },
    category: 'Collaboration',
    requirements: ['Avoir 500+ abonnés']
  },
  {
    id: '6',
    title: 'Créateur du mois',
    description: 'Soyez dans le top 10 des créateurs les plus actifs ce mois-ci',
    difficulty: 'hard',
    status: 'available',
    progress: 0,
    maxProgress: 100,
    reward: { type: 'money', amount: 200, currency: 'EUR' },
    timeLimit: 720, // 30 jours
    category: 'Compétition'
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

const statusIcons = {
  available: Target,
  in_progress: Clock,
  completed: CheckCircle,
  locked: Lock
};

function QuestCard({ quest }: { quest: Quest }) {
  const StatusIcon = statusIcons[quest.status];
  
  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      quest.status === 'locked' ? 'opacity-60' : 'hover:scale-[1.02]'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
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
        {quest.status !== 'locked' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{quest.progress}/{quest.maxProgress}</span>
            </div>
            <Progress 
              value={(quest.progress / quest.maxProgress) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Reward */}
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          {quest.reward.type === 'money' ? (
            <Coins className="h-4 w-4 text-yellow-600" />
          ) : quest.reward.type === 'points' ? (
            <Star className="h-4 w-4 text-yellow-600" />
          ) : (
            <Trophy className="h-4 w-4 text-yellow-600" />
          )}
          <span className="text-sm font-medium">
            Récompense: {quest.reward.amount} {quest.reward.currency || 'points'}
          </span>
        </div>

        {/* Time limit */}
        {quest.timeLimit && quest.status === 'in_progress' && (
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <Clock className="h-4 w-4" />
            <span>Temps restant: {quest.timeLimit}h</span>
          </div>
        )}

        {/* Requirements */}
        {quest.requirements && quest.status === 'locked' && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-600">Prérequis:</span>
            <ul className="text-sm text-gray-500 space-y-1">
              {quest.requirements.map((req, index) => (
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
          disabled={quest.status === 'locked' || quest.status === 'completed'}
          variant={quest.status === 'completed' ? 'outline' : 'default'}
        >
          {quest.status === 'completed' && 'Terminé'}
          {quest.status === 'in_progress' && 'Continuer'}
          {quest.status === 'available' && 'Commencer'}
          {quest.status === 'locked' && 'Verrouillé'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function QuestsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', ...Array.from(new Set(mockQuests.map(q => q.category)))];
  
  const filteredQuests = selectedCategory === 'all' 
    ? mockQuests 
    : mockQuests.filter(q => q.category === selectedCategory);

  const stats = {
    completed: mockQuests.filter(q => q.status === 'completed').length,
    inProgress: mockQuests.filter(q => q.status === 'in_progress').length,
    totalEarned: mockQuests
      .filter(q => q.status === 'completed' && q.reward.type === 'money')
      .reduce((sum, q) => sum + q.reward.amount, 0),
    totalPoints: mockQuests
      .filter(q => q.status === 'completed' && q.reward.type === 'points')
      .reduce((sum, q) => sum + q.reward.amount, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Quêtes Creator</h1>
        <p className="text-muted-foreground">
          Accomplissez des quêtes pour débloquer des récompenses et faire progresser votre carrière de créateur.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quêtes terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              sur {mockQuests.length} quêtes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              quêtes actives
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
              récompenses débloquées
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
              points accumulés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category === 'all' ? 'Toutes' : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 