'use client';

import { 
  Trophy, 
  Medal, 
  Award, 
  Crown,
  Star,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  Flame,
  Zap,
  Gem,
  Shield,
  Rocket
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

// Fake data pour le leaderboard avec emojis
const mockCreators: Creator[] = [
  {
    id: '1',
    name: '👑 Sophie Martin',
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
    name: '🥈 Alexandre Dubois',
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
    name: '🥉 Marie Leroy',
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
    name: '⚡ Thomas Bernard',
    points: 634,
    level: 'Master',
    sitesCreated: 12,
    conversions: 24,
    earnings: 1180.00,
    rank: 4
  },
  {
    id: '5',
    name: '🌟 Julie Moreau',
    points: 523,
    level: 'Expert',
    sitesCreated: 11,
    conversions: 19,
    earnings: 945.50,
    rank: 5
  },
  {
    id: '6',
    name: '🚀 Pierre Durand',
    points: 445,
    level: 'Expert',
    sitesCreated: 9,
    conversions: 16,
    earnings: 780.25,
    rank: 6
  },
  {
    id: '7',
    name: '🎮 Vous',
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
      return (
        <div className="relative transform hover:scale-110 transition-all duration-300">
          <Crown className="h-10 w-10 text-yellow-500 animate-bounce drop-shadow-2xl" />
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-spin" />
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
        </div>
      );
    case 2:
      return (
        <div className="relative transform hover:scale-110 transition-all duration-300">
          <Medal className="h-9 w-9 text-gray-400 animate-pulse drop-shadow-xl" />
          <Star className="absolute -top-1 -right-1 h-4 w-4 text-gray-300 animate-ping" />
          <div className="absolute inset-0 bg-gray-400/20 rounded-full animate-pulse"></div>
        </div>
      );
    case 3:
      return (
        <div className="relative transform hover:scale-110 transition-all duration-300">
          <Award className="h-8 w-8 text-amber-600 animate-pulse drop-shadow-lg" />
          <Zap className="absolute -top-1 -right-1 h-4 w-4 text-amber-400 animate-bounce" />
          <div className="absolute inset-0 bg-amber-600/20 rounded-full animate-pulse"></div>
        </div>
      );
    default:
      return (
        <div className="relative group">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl transform hover:scale-110 hover:rotate-12 transition-all duration-300 group-hover:shadow-2xl">
            <span className="text-lg font-bold text-white drop-shadow-lg">#{rank}</span>
          </div>
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      );
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Legend':
      return 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg shadow-red-200 animate-pulse';
    case 'Master':
      return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 shadow-lg shadow-yellow-200 animate-pulse';
    case 'Expert':
      return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-lg shadow-purple-200';
    case 'Confirmé':
      return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg shadow-blue-200';
    default:
      return 'bg-gradient-to-r from-gray-400 to-slate-500 text-white border-0 shadow-lg shadow-gray-200';
  }
};

interface CreatorLeaderboardProps {
  period?: 'week' | 'month' | 'all';
}

export function CreatorLeaderboard({ period = 'month' }: CreatorLeaderboardProps) {
  const topCreators = mockCreators.slice(0, 6);
  const currentUser = mockCreators.find(c => c.isCurrentUser);

  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl">
      {/* Gaming Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
          🏆 Hall of Fame Gaming 🏆
        </h2>
        <p className="text-gray-600 text-lg">Les légendes du Creator Gaming • Combat épique en temps réel !</p>
      </div>

      {/* Header Card */}
      <Card className="bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 p-1 shadow-2xl">
        <div className="bg-white rounded-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 shadow-lg">
                    <Trophy className="h-6 w-6 text-white animate-bounce" />
                  </div>
                  <span className="bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                    🎮 Classement des Legends
                  </span>
                </CardTitle>
                <CardDescription className="text-lg">
                  ⚡ Top performers ce mois-ci • 🔥 Mis à jour en temps réel
                </CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg px-4 py-2 shadow-lg animate-pulse">
                {period === 'week' ? '📅 Cette semaine' : 
                 period === 'month' ? '🗓️ Ce mois' : '⏰ Tout temps'}
              </Badge>
            </div>
          </CardHeader>
        </div>
      </Card>

      {/* Top 3 Podium Cards - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {topCreators.slice(0, 3).map((creator, index) => {
          const rankEmojis = ['👑', '🥈', '🥉'];
          const gradients = [
            'from-yellow-400 via-orange-500 to-red-500',
            'from-gray-300 via-slate-400 to-gray-600', 
            'from-amber-400 via-yellow-500 to-orange-500'
          ];
          const glows = [
            'shadow-yellow-500/50',
            'shadow-gray-400/50',
            'shadow-amber-500/50'
          ];
          const heights = ['md:h-80', 'md:h-72', 'md:h-64']; // Différentes hauteurs pour effet podium
          
          return (
            <div
              key={creator.id}
              className={`
                relative p-8 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500
                bg-gradient-to-br ${gradients[index]} text-white ${glows[index]} shadow-2xl ${heights[index]}
                ring-4 ring-white/30 hover:ring-white/60 hover:shadow-3xl
                before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-pulse
                group cursor-pointer
              `}
              style={{
                transform: index === 0 ? 'perspective(1000px) rotateX(5deg)' : 
                          index === 1 ? 'perspective(1000px) rotateX(3deg) rotateY(-2deg)' : 
                          'perspective(1000px) rotateX(3deg) rotateY(2deg)'
              }}
            >
              {/* Effet de particules flottantes */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      absolute w-2 h-2 rounded-full animate-float
                      ${index === 0 ? 'bg-yellow-300' : index === 1 ? 'bg-gray-300' : 'bg-amber-300'}
                    `}
                    style={{
                      left: `${20 + i * 10}%`,
                      top: `${10 + i * 8}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + i * 0.2}s`
                    }}
                  />
                ))}
              </div>

              {/* Rang avec effet 3D */}
              <div className="text-center mb-6">
                <div 
                  className="text-8xl animate-bounce filter drop-shadow-2xl transform group-hover:scale-110 transition-all duration-300"
                  style={{
                    textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)',
                    transform: 'perspective(500px) rotateX(15deg)'
                  }}
                >
                  {rankEmojis[index]}
                </div>
              </div>
              
              <div className="text-center space-y-6 relative z-10">
                <Avatar className="h-24 w-24 mx-auto ring-8 ring-white shadow-2xl transform hover:rotate-12 hover:scale-110 transition-all duration-500 group-hover:ring-16">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {creator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-bold text-2xl drop-shadow-lg group-hover:text-3xl transition-all duration-300">{creator.name}</h3>
                  <p className="text-lg opacity-90 font-bold">{creator.level}</p>
                </div>
                
                <div className="space-y-4 text-lg bg-black/30 rounded-2xl p-6 backdrop-blur-sm transform group-hover:bg-black/40 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-bold">⚡ Points:</span>
                    <span className="font-bold text-2xl group-hover:text-3xl transition-all duration-300">{creator.points}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-bold">🎨 Sites:</span>
                    <span className="font-bold text-xl">{creator.sitesCreated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-bold">💰 Conversions:</span>
                    <span className="font-bold text-xl">{creator.conversions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-bold">💸 Gains:</span>
                    <span className="font-bold text-xl">
                      {creator.earnings.toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Effet de lueur au hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Classement complet - Gaming Style Enhanced */}
      <Card className="bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 animate-pulse" />
            <span>🎯 Classement Gaming Complet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2">
            {topCreators.slice(3).map((creator, index) => (
              <div 
                key={creator.id} 
                className="group flex items-center gap-4 p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 border-b border-gray-100 last:border-b-0 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)`,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex items-center justify-center w-12 transform group-hover:scale-110 transition-all duration-300">
                  {getRankIcon(creator.rank)}
                </div>
                
                <Avatar className="h-16 w-16 ring-4 ring-blue-300 shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg">
                    {creator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-xl group-hover:text-2xl transition-all duration-300">{creator.name}</span>
                    <Badge className={`${getLevelColor(creator.level)} transform group-hover:scale-110 transition-all duration-300`} variant="outline">
                      {creator.level === 'Master' && '👑'}
                      {creator.level === 'Expert' && '⭐'}
                      {creator.level}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    🎨 {creator.sitesCreated} sites • 💰 {creator.conversions} conversions
                  </div>
                </div>
                
                <div className="text-right transform group-hover:scale-110 transition-all duration-300">
                  <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:text-3xl transition-all duration-300">
                    ⚡ {creator.points} pts
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    💸 {creator.earnings.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </div>
                </div>

                {/* Effet de particules au hover */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"
                      style={{
                        left: `${30 + i * 20}%`,
                        top: `${20 + i * 15}%`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Votre position - Ultra Gaming Style */}
      {currentUser && (
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 ring-4 ring-blue-400 ring-opacity-50 transform hover:scale-105 transition-all duration-500">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse" />
          
          {/* Special effects */}
          <div className="absolute top-2 right-2">
            <Rocket className="h-6 w-6 text-blue-500 animate-bounce" />
          </div>
          <div className="absolute bottom-2 left-2">
            <Zap className="h-5 w-5 text-purple-500 animate-pulse" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎮 Votre Position Gaming
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform hover:scale-110 hover:rotate-12 transition-all duration-300">
                <span className="text-lg font-bold text-white">#{currentUser.rank}</span>
              </div>
              
              <Avatar className="h-16 w-16 ring-4 ring-blue-300 shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xl">{currentUser.name}</span>
                  <Badge className={getLevelColor(currentUser.level)}>
                    🎯 {currentUser.level}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  🎨 {currentUser.sitesCreated} sites créés • 💰 {currentUser.conversions} conversions réussies
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ⚡ {currentUser.points} pts
                </div>
                <div className="text-sm font-bold text-green-600">
                  💸 {currentUser.earnings.toLocaleString('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  })}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-xl border-2 border-blue-300 shadow-lg">
              <div className="flex items-center gap-3 text-sm font-bold">
                <TrendingUp className="h-5 w-5 text-blue-600 animate-bounce" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🚀 Vous êtes à {mockCreators[5].points - currentUser.points} points du top 6 ! 
                  Continuez le combat épique ! ⚔️
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 