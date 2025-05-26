'use client';

import { 
  Trophy, 
  Medal, 
  Award, 
  Crown,
  Star,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';

interface Creator {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: string;
  sitesCreated: number;
  conversions: number;
  earnings: number;
  rank: number;
  isCurrentUser?: boolean;
}

// Fake data pour le leaderboard
const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    avatar: '/avatars/sophie.jpg',
    points: 1247,
    level: 'Legend',
    sitesCreated: 23,
    conversions: 45,
    earnings: 2340.50,
    rank: 1
  },
  {
    id: '2',
    name: 'Alexandre Dubois',
    avatar: '/avatars/alex.jpg',
    points: 892,
    level: 'Master',
    sitesCreated: 18,
    conversions: 32,
    earnings: 1680.25,
    rank: 2
  },
  {
    id: '3',
    name: 'Marie Leroy',
    avatar: '/avatars/marie.jpg',
    points: 756,
    level: 'Master',
    sitesCreated: 15,
    conversions: 28,
    earnings: 1420.75,
    rank: 3
  },
  {
    id: '4',
    name: 'Thomas Bernard',
    points: 634,
    level: 'Master',
    sitesCreated: 12,
    conversions: 24,
    earnings: 1180.00,
    rank: 4
  },
  {
    id: '5',
    name: 'Julie Moreau',
    points: 523,
    level: 'Expert',
    sitesCreated: 11,
    conversions: 19,
    earnings: 945.50,
    rank: 5
  },
  {
    id: '6',
    name: 'Pierre Durand',
    points: 445,
    level: 'Expert',
    sitesCreated: 9,
    conversions: 16,
    earnings: 780.25,
    rank: 6
  },
  {
    id: '7',
    name: 'Vous',
    points: 127,
    level: 'Débutant',
    sitesCreated: 4,
    conversions: 3,
    earnings: 345.50,
    rank: 47,
    isCurrentUser: true
  }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Legend':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Master':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Expert':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Confirmé':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

interface CreatorLeaderboardProps {
  period?: 'week' | 'month' | 'all';
}

export function CreatorLeaderboard({ period = 'month' }: CreatorLeaderboardProps) {
  const topCreators = mockCreators.slice(0, 6);
  const currentUser = mockCreators.find(c => c.isCurrentUser);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Classement des Creators
              </CardTitle>
              <CardDescription>
                Top performers ce mois-ci • Mis à jour en temps réel
              </CardDescription>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              {period === 'week' ? 'Cette semaine' : 
               period === 'month' ? 'Ce mois' : 'Tout temps'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topCreators.slice(0, 3).map((creator, index) => (
          <Card key={creator.id} className={`relative overflow-hidden ${
            index === 0 ? 'ring-2 ring-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' :
            index === 1 ? 'ring-2 ring-gray-300 bg-gradient-to-br from-gray-50 to-slate-50' :
            'ring-2 ring-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50'
          }`}>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                {getRankIcon(creator.rank)}
              </div>
              <div className="flex justify-center mb-3">
                <Avatar className="h-16 w-16 ring-4 ring-white">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="text-lg font-bold">
                    {creator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-lg">{creator.name}</CardTitle>
              <Badge className={getLevelColor(creator.level)}>
                {creator.level}
              </Badge>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {creator.points} pts
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">{creator.sitesCreated}</div>
                  <div className="text-gray-500">Sites</div>
                </div>
                <div>
                  <div className="font-medium">{creator.conversions}</div>
                  <div className="text-gray-500">Conversions</div>
                </div>
              </div>
              <div className="text-sm text-green-600 font-medium">
                {creator.earnings.toLocaleString('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR' 
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Classement complet */}
      <Card>
        <CardHeader>
          <CardTitle>Classement complet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCreators.slice(3).map((creator) => (
              <div key={creator.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(creator.rank)}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback>
                    {creator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{creator.name}</span>
                    <Badge className={getLevelColor(creator.level)} variant="outline">
                      {creator.level}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {creator.sitesCreated} sites • {creator.conversions} conversions
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-blue-600">{creator.points} pts</div>
                  <div className="text-sm text-green-600">
                    {creator.earnings.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Votre position */}
      {currentUser && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Votre position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white border">
              <div className="flex items-center justify-center w-8">
                <span className="text-lg font-bold text-blue-600">#{currentUser.rank}</span>
              </div>
              
              <Avatar className="h-12 w-12 ring-2 ring-blue-200">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-lg">{currentUser.name}</span>
                  <Badge className={getLevelColor(currentUser.level)}>
                    {currentUser.level}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {currentUser.sitesCreated} sites créés • {currentUser.conversions} conversions réussies
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">{currentUser.points} pts</div>
                <div className="text-sm text-green-600 font-medium">
                  {currentUser.earnings.toLocaleString('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  })}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <TrendingUp className="h-4 w-4" />
                <span>
                  Vous êtes à {mockCreators[5].points - currentUser.points} points du top 6 !
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 