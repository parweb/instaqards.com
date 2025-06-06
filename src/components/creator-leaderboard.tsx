'use client';

import {
  LuAward,
  LuCrown,
  LuDollarSign,
  LuMedal,
  LuRocket,
  LuShield,
  LuSparkles,
  LuStar,
  LuTarget,
  LuTrendingUp,
  LuTrophy,
  LuZap
} from 'react-icons/lu';

import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Badge } from 'components/ui/badge';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from 'components/ui/card';

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
    earnings: 2340.5,
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
    earnings: 1180.0,
    rank: 4
  },
  {
    id: '5',
    name: '🌟 Julie Moreau',
    points: 523,
    level: 'Expert',
    sitesCreated: 11,
    conversions: 19,
    earnings: 945.5,
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
    earnings: 345.5,
    rank: 47,
    isCurrentUser: true
  }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return (
        <div className="relative transform transition-all duration-300 hover:scale-110">
          <LuCrown className="h-10 w-10 animate-bounce text-yellow-500 drop-shadow-2xl" />
          <LuSparkles className="absolute -top-2 -right-2 h-6 w-6 animate-spin text-yellow-400" />
          <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400/20"></div>
        </div>
      );
    case 2:
      return (
        <div className="relative transform transition-all duration-300 hover:scale-110">
          <LuMedal className="h-9 w-9 animate-pulse text-gray-400 drop-shadow-xl" />
          <LuStar className="absolute -top-1 -right-1 h-4 w-4 animate-ping text-gray-300" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-gray-400/20"></div>
        </div>
      );
    case 3:
      return (
        <div className="relative transform transition-all duration-300 hover:scale-110">
          <LuAward className="h-8 w-8 animate-pulse text-amber-600 drop-shadow-lg" />
          <LuZap className="absolute -top-1 -right-1 h-4 w-4 animate-bounce text-amber-400" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-amber-600/20"></div>
        </div>
      );
    default:
      return (
        <div className="group relative">
          <div className="flex h-10 w-10 transform items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl transition-all duration-300 group-hover:shadow-2xl hover:scale-110 hover:rotate-12">
            <span className="text-lg font-bold text-white drop-shadow-lg">
              #{rank}
            </span>
          </div>
          <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
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

export function CreatorLeaderboard({
  period = 'month'
}: CreatorLeaderboardProps) {
  const topCreators = mockCreators.slice(0, 6);
  const currentUser = mockCreators.find(c => c.isCurrentUser);

  return (
    <div className="space-y-8 rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Gaming Header */}
      <div className="space-y-2 text-center">
        <h2 className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-4xl font-bold text-transparent">
          🏆 Hall of Fame Gaming 🏆
        </h2>
        <p className="text-lg text-gray-600">
          Les légendes du Creator Gaming • Combat épique en temps réel !
        </p>
      </div>

      {/* Header Card */}
      <Card className="bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 p-1 shadow-2xl">
        <div className="rounded-lg bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 p-2 shadow-lg">
                    <LuTrophy className="h-6 w-6 animate-bounce text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                    🎮 Classement des Legends
                  </span>
                </CardTitle>
                <CardDescription className="text-lg">
                  ⚡ Top performers ce mois-ci • 🔥 Mis à jour en temps réel
                </CardDescription>
              </div>
              <Badge className="animate-pulse bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-lg text-white shadow-lg">
                {period === 'week'
                  ? '📅 Cette semaine'
                  : period === 'month'
                    ? '🗓️ Ce mois'
                    : '⏰ Tout temps'}
              </Badge>
            </div>
          </CardHeader>
        </div>
      </Card>

      {/* Top 3 Podium Cards - Enhanced */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
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
              className={`relative transform rounded-3xl bg-gradient-to-br p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${gradients[index]} text-white ${glows[index]} shadow-2xl ${heights[index]} hover:shadow-3xl group cursor-pointer ring-4 ring-white/30 before:absolute before:inset-0 before:animate-pulse before:rounded-3xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent hover:ring-white/60`}
              style={{
                transform:
                  index === 0
                    ? 'perspective(1000px) rotateX(5deg)'
                    : index === 1
                      ? 'perspective(1000px) rotateX(3deg) rotateY(-2deg)'
                      : 'perspective(1000px) rotateX(3deg) rotateY(2deg)'
              }}
            >
              {/* Effet de particules flottantes */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`animate-float absolute h-2 w-2 rounded-full ${index === 0 ? 'bg-yellow-300' : index === 1 ? 'bg-gray-300' : 'bg-amber-300'} `}
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
              <div className="mb-6 text-center">
                <div
                  className="transform animate-bounce text-8xl drop-shadow-2xl filter transition-all duration-300 group-hover:scale-110"
                  style={{
                    textShadow:
                      '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)',
                    transform: 'perspective(500px) rotateX(15deg)'
                  }}
                >
                  {rankEmojis[index]}
                </div>
              </div>

              <div className="relative z-10 space-y-6 text-center">
                <Avatar className="mx-auto h-24 w-24 transform shadow-2xl ring-8 ring-white transition-all duration-500 group-hover:ring-16 hover:scale-110 hover:rotate-12">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-3xl font-bold text-white">
                    {creator.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-2xl font-bold drop-shadow-lg transition-all duration-300 group-hover:text-3xl">
                    {creator.name}
                  </h3>
                  <p className="text-lg font-bold opacity-90">
                    {creator.level}
                  </p>
                </div>

                <div className="transform space-y-4 rounded-2xl bg-black/30 p-6 text-lg backdrop-blur-sm transition-all duration-300 group-hover:bg-black/40">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold">
                      ⚡ Points:
                    </span>
                    <span className="text-2xl font-bold transition-all duration-300 group-hover:text-3xl">
                      {creator.points}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold">
                      🎨 Sites:
                    </span>
                    <span className="text-xl font-bold">
                      {creator.sitesCreated}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold">
                      <LuDollarSign /> Conversions:
                    </span>
                    <span className="text-xl font-bold">
                      {creator.conversions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold">
                      💸 Gains:
                    </span>
                    <span className="text-xl font-bold">
                      {creator.earnings.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Effet de lueur au hover */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            </div>
          );
        })}
      </div>

      {/* Classement complet - Gaming Style Enhanced */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <LuShield className="h-6 w-6 animate-pulse" />
            <span>🎯 Classement Gaming Complet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2">
            {topCreators.slice(3).map((creator, index) => (
              <div
                key={creator.id}
                className="group flex transform items-center gap-4 border-b border-gray-100 p-6 transition-all duration-300 last:border-b-0 hover:-translate-y-1 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)`,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex w-12 transform items-center justify-center transition-all duration-300 group-hover:scale-110">
                  {getRankIcon(creator.rank)}
                </div>

                <Avatar className="h-16 w-16 transform shadow-xl ring-4 ring-blue-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-bold text-white">
                    {creator.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-xl font-bold transition-all duration-300 group-hover:text-2xl">
                      {creator.name}
                    </span>
                    <Badge
                      className={`${getLevelColor(creator.level)} transform transition-all duration-300 group-hover:scale-110`}
                      variant="outline"
                    >
                      {creator.level === 'Master' && '👑'}
                      {creator.level === 'Expert' && '⭐'}
                      {creator.level}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    🎨 {creator.sitesCreated} sites • <LuDollarSign />{' '}
                    {creator.conversions} conversions
                  </div>
                </div>

                <div className="transform text-right transition-all duration-300 group-hover:scale-110">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent transition-all duration-300 group-hover:text-3xl">
                    ⚡ {creator.points} pts
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    💸{' '}
                    {creator.earnings.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </div>
                </div>

                {/* Effet de particules au hover */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-all duration-300 group-hover:animate-ping group-hover:opacity-100"
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
        <Card className="ring-opacity-50 relative transform overflow-hidden border-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-2xl ring-4 ring-blue-400 transition-all duration-500 hover:scale-105">
          {/* Animated background */}
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20" />

          {/* Special effects */}
          <div className="absolute top-2 right-2">
            <LuRocket className="h-6 w-6 animate-bounce text-blue-500" />
          </div>
          <div className="absolute bottom-2 left-2">
            <LuZap className="h-5 w-5 animate-pulse text-purple-500" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 shadow-lg">
                <LuTarget className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎮 Votre Position Gaming
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex transform items-center gap-4 rounded-xl border-2 border-blue-200 bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="flex h-12 w-12 transform items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-lg font-bold text-white">
                  #{currentUser.rank}
                </span>
              </div>

              <Avatar className="h-16 w-16 transform shadow-2xl ring-4 ring-blue-300 transition-all duration-300 hover:scale-110 hover:rotate-6">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-bold text-white">
                  {currentUser.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xl font-bold">{currentUser.name}</span>
                  <Badge className={getLevelColor(currentUser.level)}>
                    🎯 {currentUser.level}
                  </Badge>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  🎨 {currentUser.sitesCreated} sites créés • <LuDollarSign />{' '}
                  {currentUser.conversions} conversions réussies
                </div>
              </div>

              <div className="text-right">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                  ⚡ {currentUser.points} pts
                </div>
                <div className="text-sm font-bold text-green-600">
                  💸{' '}
                  {currentUser.earnings.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border-2 border-blue-300 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-4 shadow-lg">
              <div className="flex items-center gap-3 text-sm font-bold">
                <LuTrendingUp className="h-5 w-5 animate-bounce text-blue-600" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🚀 Vous êtes à {mockCreators[5].points - currentUser.points}{' '}
                  points du top 6 ! Continuez le combat épique ! ⚔️
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
