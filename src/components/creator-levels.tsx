'use client';

import { 
  Star, 
  Crown, 
  Zap, 
  Trophy, 
  Target,
  TrendingUp,
  Award,
  Gem
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Progress } from 'components/ui/progress';

interface CreatorLevel {
  id: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: React.ComponentType<any>;
  color: string;
  benefits: string[];
  commissionBonus: number;
}

const creatorLevels: CreatorLevel[] = [
  {
    id: 1,
    name: 'Débutant',
    minPoints: 0,
    maxPoints: 99,
    icon: Target,
    color: 'text-gray-600',
    benefits: [
      'Accès aux quêtes de base',
      'Commission standard 5%',
      'Support par email'
    ],
    commissionBonus: 0
  },
  {
    id: 2,
    name: 'Confirmé',
    minPoints: 100,
    maxPoints: 299,
    icon: Star,
    color: 'text-blue-600',
    benefits: [
      'Accès aux quêtes avancées',
      'Commission +10% (5.5%)',
      'Support prioritaire',
      'Templates exclusifs'
    ],
    commissionBonus: 10
  },
  {
    id: 3,
    name: 'Expert',
    minPoints: 300,
    maxPoints: 599,
    icon: Trophy,
    color: 'text-purple-600',
    benefits: [
      'Accès aux quêtes premium',
      'Commission +25% (6.25%)',
      'Support dédié',
      'Accès anticipé aux nouveautés',
      'Badge Expert visible'
    ],
    commissionBonus: 25
  },
  {
    id: 4,
    name: 'Master',
    minPoints: 600,
    maxPoints: 999,
    icon: Crown,
    color: 'text-yellow-600',
    benefits: [
      'Accès aux quêtes VIP',
      'Commission +50% (7.5%)',
      'Manager personnel',
      'Participation aux décisions produit',
      'Revenus garantis mensuels'
    ],
    commissionBonus: 50
  },
  {
    id: 5,
    name: 'Legend',
    minPoints: 1000,
    maxPoints: Infinity,
    icon: Gem,
    color: 'text-red-600',
    benefits: [
      'Accès illimité à toutes les quêtes',
      'Commission +100% (10%)',
      'Équipe dédiée',
      'Co-création de nouvelles quêtes',
      'Revenus garantis + bonus performance',
      'Statut Legend à vie'
    ],
    commissionBonus: 100
  }
];

interface CreatorLevelsProps {
  currentPoints: number;
  currentLevel?: CreatorLevel;
}

export function CreatorLevels({ currentPoints }: CreatorLevelsProps) {
  const currentLevel = creatorLevels.find(
    level => currentPoints >= level.minPoints && currentPoints <= level.maxPoints
  ) || creatorLevels[0];

  const nextLevel = creatorLevels.find(level => level.minPoints > currentPoints);
  const progressToNext = nextLevel 
    ? ((currentPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  const pointsToNext = nextLevel ? nextLevel.minPoints - currentPoints : 0;

  const CurrentIcon = currentLevel.icon;

  return (
    <div className="space-y-6">
      {/* Current Level Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-white shadow-md ${currentLevel.color}`}>
                <CurrentIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Niveau {currentLevel.name}</CardTitle>
                <CardDescription>
                  {currentPoints} points • Commission {(5 + (5 * currentLevel.commissionBonus / 100)).toFixed(1)}%
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
              Niveau {currentLevel.id}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress to next level */}
          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression vers {nextLevel.name}</span>
                <span>{pointsToNext} points restants</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
            </div>
          )}

          {/* Current benefits */}
          <div>
            <h4 className="font-medium mb-2">Avantages actuels :</h4>
            <ul className="space-y-1">
              {currentLevel.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* All Levels Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les niveaux Creator</CardTitle>
          <CardDescription>
            Gagnez des points en complétant des quêtes pour débloquer de nouveaux avantages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creatorLevels.map((level) => {
              const LevelIcon = level.icon;
              const isCurrentLevel = level.id === currentLevel.id;
              const isUnlocked = currentPoints >= level.minPoints;
              
              return (
                <div 
                  key={level.id} 
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    isCurrentLevel 
                      ? 'border-blue-300 bg-blue-50' 
                      : isUnlocked 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isCurrentLevel ? 'bg-blue-100' : isUnlocked ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <LevelIcon className={`h-5 w-5 ${level.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{level.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {level.minPoints === 0 ? '0' : level.minPoints}
                        {level.maxPoints === Infinity ? '+' : `-${level.maxPoints}`} points
                      </Badge>
                      {isCurrentLevel && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          Actuel
                        </Badge>
                      )}
                      {isUnlocked && !isCurrentLevel && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Débloqué
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Commission: {(5 + (5 * level.commissionBonus / 100)).toFixed(1)}% 
                      {level.commissionBonus > 0 && (
                        <span className="text-green-600 ml-1">
                          (+{level.commissionBonus}%)
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                          Voir les avantages
                        </summary>
                        <ul className="mt-2 space-y-1 ml-4">
                          {level.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="h-1 w-1 bg-gray-400 rounded-full" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 