'use client';

import {
  LuCrown,
  LuFlame,
  LuGem,
  LuRocket,
  LuShield,
  LuSparkles,
  LuStar,
  LuTarget,
  LuTrophy,
  LuZap
} from 'react-icons/lu';

import { Badge } from 'components/ui/badge';
import { Progress } from 'components/ui/progress';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from 'components/ui/card';

interface CreatorLevel {
  id: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  benefits: string[];
  commissionBonus: number;
  emoji: string;
}

const creatorLevels: CreatorLevel[] = [
  {
    id: 1,
    name: 'Débutant',
    minPoints: 0,
    maxPoints: 99,
    icon: LuTarget,
    color: 'text-gray-600',
    gradient: 'from-gray-400 to-slate-500',
    emoji: '🎯',
    benefits: [
      '🎮 Accès aux quêtes de base',
      '💰 Commission standard 5%',
      '📧 Support par email'
    ],
    commissionBonus: 0
  },
  {
    id: 2,
    name: 'Confirmé',
    minPoints: 100,
    maxPoints: 299,
    icon: LuStar,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-indigo-600',
    emoji: '⭐',
    benefits: [
      '🚀 Accès aux quêtes avancées',
      '💎 Commission +10% (5.5%)',
      '⚡ Support prioritaire',
      '🎨 Templates exclusifs'
    ],
    commissionBonus: 10
  },
  {
    id: 3,
    name: 'Expert',
    minPoints: 300,
    maxPoints: 599,
    icon: LuTrophy,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-violet-600',
    emoji: '🏆',
    benefits: [
      '💫 Accès aux quêtes premium',
      '🔥 Commission +25% (6.25%)',
      '🛡️ Support dédié',
      '🎁 Accès anticipé aux nouveautés',
      '✨ Badge Expert visible'
    ],
    commissionBonus: 25
  },
  {
    id: 4,
    name: 'Master',
    minPoints: 600,
    maxPoints: 999,
    icon: LuCrown,
    color: 'text-yellow-600',
    gradient: 'from-yellow-400 to-amber-500',
    emoji: '👑',
    benefits: [
      '🌟 Accès aux quêtes VIP',
      '💰 Commission +50% (7.5%)',
      '🤝 Manager personnel',
      '🎯 Participation aux décisions produit',
      '💸 Revenus garantis mensuels'
    ],
    commissionBonus: 50
  },
  {
    id: 5,
    name: 'Legend',
    minPoints: 1000,
    maxPoints: Infinity,
    icon: LuGem,
    color: 'text-red-600',
    gradient: 'from-red-500 to-pink-600',
    emoji: '💎',
    benefits: [
      '🌈 Accès illimité à toutes les quêtes',
      '🚀 Commission +100% (10%)',
      '👥 Équipe dédiée',
      '🎮 Co-création de nouvelles quêtes',
      '💎 Revenus garantis + bonus performance',
      '🏅 Statut Legend à vie'
    ],
    commissionBonus: 100
  }
];

interface CreatorLevelsProps {
  currentPoints: number;
  currentLevel?: CreatorLevel;
}

export function CreatorLevels({ currentPoints }: CreatorLevelsProps) {
  const currentLevel =
    creatorLevels.find(
      level =>
        currentPoints >= level.minPoints && currentPoints <= level.maxPoints
    ) || creatorLevels[0];

  const nextLevel = creatorLevels.find(
    level => level.minPoints > currentPoints
  );
  const progressToNext = nextLevel
    ? ((currentPoints - currentLevel.minPoints) /
        (nextLevel.minPoints - currentLevel.minPoints)) *
      100
    : 100;

  const pointsToNext = nextLevel ? nextLevel.minPoints - currentPoints : 0;

  const CurrentIcon = currentLevel.icon;

  return (
    <div className="space-y-6 rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Gaming Header */}
      <div className="space-y-2 text-center">
        <h2 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
          🎮 Système de Niveaux Gaming 🎮
        </h2>
        <p className="text-gray-600">
          Montez en niveau pour débloquer des pouvoirs épiques !
        </p>
      </div>

      {/* Current Level Card - Ultra Gaming Style */}
      <Card
        className={`ring-opacity-50 relative transform overflow-hidden border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-2xl ring-4 transition-all duration-300 hover:scale-105 ring-${currentLevel.gradient.split('-')[1]}-400 `}
      >
        {/* Animated background effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentLevel.gradient} animate-pulse opacity-10`}
        />

        {/* Sparkle effects */}
        <div className="absolute top-2 right-2">
          <LuSparkles className="h-6 w-6 animate-spin text-yellow-500" />
        </div>
        <div className="absolute bottom-2 left-2">
          <LuFlame className="h-5 w-5 animate-bounce text-orange-500" />
        </div>

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`transform rounded-full bg-gradient-to-r p-4 shadow-2xl transition-all duration-300 hover:rotate-12 ${currentLevel.gradient} `}
              >
                <CurrentIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {currentLevel.emoji} Niveau {currentLevel.name}
                  </span>
                </CardTitle>
                <CardDescription className="text-lg font-medium">
                  ⚡ {currentPoints} points • 💰 Commission{' '}
                  {(5 + (5 * currentLevel.commissionBonus) / 100).toFixed(1)}%
                </CardDescription>
              </div>
            </div>
            <Badge
              className={`animate-pulse bg-gradient-to-r px-4 py-2 text-lg shadow-lg ${currentLevel.gradient} border-0 text-white`}
            >
              🏅 Niveau {currentLevel.id}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          {/* Progress to next level with epic styling */}
          {nextLevel && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold">
                <span className="flex items-center gap-2">
                  <LuRocket className="h-4 w-4 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Progression vers {nextLevel.emoji} {nextLevel.name}
                  </span>
                </span>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  🎯 {pointsToNext} points restants
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={progressToNext}
                  className="h-4 bg-gray-200 shadow-inner"
                />
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-30" />
              </div>
            </div>
          )}

          {/* Current benefits with gaming style */}
          <div className="rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 p-4 shadow-lg">
            <h4 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <LuShield className="h-5 w-5 text-green-600" />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                🎮 Pouvoirs actuels débloqués :
              </span>
            </h4>
            <ul className="space-y-2">
              {currentLevel.benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex transform items-center gap-3 rounded-lg bg-white/50 p-2 shadow-sm transition-all duration-200 hover:scale-105"
                >
                  <div className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg" />
                  <span className="text-sm font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* All Levels Overview - Gaming Grid */}
      <Card className="border-0 bg-gradient-to-br from-white via-purple-50 to-pink-50 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <LuTrophy className="h-6 w-6 text-yellow-500" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🏆 Arbre des Niveaux Gaming
            </span>
          </CardTitle>
          <CardDescription className="text-lg">
            🚀 Gagnez des points en complétant des quêtes épiques pour débloquer
            de nouveaux pouvoirs !
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creatorLevels.map(level => {
              const LevelIcon = level.icon;
              const isCurrentLevel = level.id === currentLevel.id;
              const isUnlocked = currentPoints >= level.minPoints;

              return (
                <div
                  key={level.id}
                  className={`relative flex transform items-center gap-4 overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 hover:scale-105 ${
                    isCurrentLevel
                      ? `ring-opacity-50 border-blue-400 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 shadow-2xl ring-4 ring-blue-300`
                      : isUnlocked
                        ? `border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 shadow-xl`
                        : `border-gray-300 bg-gradient-to-r from-gray-100 to-slate-100 opacity-60`
                  } `}
                >
                  {/* Level glow effect */}
                  {isCurrentLevel && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20" />
                  )}

                  <div
                    className={`relative z-10 transform rounded-full p-3 shadow-2xl transition-all duration-300 hover:rotate-12 ${
                      isCurrentLevel
                        ? `bg-gradient-to-r ${level.gradient} animate-pulse`
                        : isUnlocked
                          ? `bg-gradient-to-r from-green-400 to-emerald-500`
                          : `bg-gradient-to-r from-gray-300 to-gray-400`
                    } `}
                  >
                    <LevelIcon className="h-6 w-6 text-white" />
                  </div>

                  <div className="relative z-10 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h4 className="flex items-center gap-2 text-lg font-bold">
                        {level.emoji} {level.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className="border-2 text-xs font-bold"
                      >
                        {level.minPoints === 0 ? '0' : level.minPoints}
                        {level.maxPoints === Infinity
                          ? '+'
                          : `-${level.maxPoints}`}{' '}
                        points
                      </Badge>
                      {isCurrentLevel && (
                        <Badge className="animate-pulse bg-gradient-to-r from-blue-500 to-purple-600 text-xs text-white shadow-lg">
                          ⚡ Actuel
                        </Badge>
                      )}
                      {isUnlocked && !isCurrentLevel && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-xs text-white shadow-lg">
                          ✅ Débloqué
                        </Badge>
                      )}
                    </div>

                    <div className="mb-3 text-sm font-bold">
                      <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        💰 Commission:{' '}
                        {(5 + (5 * level.commissionBonus) / 100).toFixed(1)}%
                      </span>
                      {level.commissionBonus > 0 && (
                        <span className="ml-2 font-bold text-green-600">
                          🔥 (+{level.commissionBonus}%)
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <details className="text-sm">
                        <summary className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent transition-all duration-300 hover:from-purple-600 hover:to-pink-600">
                          🎮 Voir tous les pouvoirs
                        </summary>
                        <ul className="mt-3 ml-4 space-y-2">
                          {level.benefits.map((benefit, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-3 rounded-lg bg-white/50 p-2 shadow-sm"
                            >
                              <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
                              <span className="font-medium">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  </div>

                  {/* Special effects for current level */}
                  {isCurrentLevel && (
                    <>
                      <div className="absolute top-2 right-2">
                        <LuSparkles className="h-5 w-5 animate-spin text-yellow-500" />
                      </div>
                      <div className="absolute right-2 bottom-2">
                        <LuZap className="h-4 w-4 animate-bounce text-blue-500" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
