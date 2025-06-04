'use client';

import { useState, useEffect } from 'react';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Progress } from 'components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from 'components/ui/hover-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from 'components/ui/dialog';

// Custom CSS animations - MODERNES ET SUBTILES
const customStyles = `
  @keyframes gentle-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes soft-glow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
  
  @keyframes subtle-shine {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.4; }
  }
  
  @keyframes subtle-shift {
    0%, 100% { 
      background-position: 0% 50%;
    }
    50% { 
      background-position: 100% 50%;
    }
  }
  
  @keyframes modern-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-2px); }
  }
  
  @keyframes clean-pulse {
    0%, 100% { 
      box-shadow: 0 0 0 0 currentColor;
      opacity: 1;
    }
    50% { 
      box-shadow: 0 0 0 8px transparent;
      opacity: 0.8;
    }
  }
  
  .animate-gentle-pulse {
    animation: gentle-pulse 3s ease-in-out infinite;
  }
  
  .animate-soft-glow {
    animation: soft-glow 4s ease-in-out infinite;
  }
  
  .animate-subtle-shine {
    animation: subtle-shine 2.5s ease-in-out infinite;
  }
  
  .animate-subtle-shift {
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    background-size: 200% 200%;
    animation: subtle-shift 8s ease-in-out infinite;
  }
  
  .animate-modern-float {
    animation: modern-float 4s ease-in-out infinite;
  }
  
  .animate-clean-pulse {
    animation: clean-pulse 3s ease-in-out infinite;
  }
  
  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .modern-grid {
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

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
  currentLevel: number;
  nextLevelPoints: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isTemporary: boolean;
  expiresAt?: Date;
  earnedAt: Date;
  category: string;
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
  totalEarnings: 345.5,
  conversionRate: 1.8,
  sitesCreated: 4,
  sitesShared: 4,
  questsCompleted: 3,
  currentPoints: 127,
  currentLevel: 3,
  nextLevelPoints: 200
};

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Boost Halloween 2024',
    description: '+20% commission pendant 30 jours',
    icon: '🎃',
    rarity: 'epic',
    isTemporary: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    earnedAt: new Date('2024-10-25'),
    category: 'Commission Boost'
  },
  {
    id: '2',
    name: 'Créateur Elite',
    description: 'Plus de 10 sites créés',
    icon: '👑',
    rarity: 'legendary',
    isTemporary: false,
    earnedAt: new Date('2024-10-01'),
    category: 'Achievement'
  },
  {
    id: '3',
    name: 'Viral Master',
    description: 'Plus de 1000 clics générés',
    icon: '🚀',
    rarity: 'rare',
    isTemporary: false,
    earnedAt: new Date('2024-10-15'),
    category: 'Performance'
  },
  {
    id: '4',
    name: 'Speed Creator',
    description: '+50% vitesse de création pendant 48h',
    icon: '⚡',
    rarity: 'rare',
    isTemporary: true,
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 heures
    earnedAt: new Date(),
    category: 'Temporary Boost'
  },
  {
    id: '5',
    name: 'Créateur Expert',
    description: 'Plus de 1000 clics générés',
    icon: '👑',
    rarity: 'legendary',
    isTemporary: false,
    earnedAt: new Date('2024-10-15'),
    category: 'Performance'
  },
  {
    id: '6',
    name: 'Créateur Expert',
    description: 'Plus de 1000 clics générés',
    icon: '👑',
    rarity: 'legendary',
    isTemporary: false,
    earnedAt: new Date('2024-10-15'),
    category: 'Performance'
  }
];

const mockQuests: Quest[] = [
  {
    id: '1',
    title: '🎃 Site Halloween 2024',
    description:
      'Créez un site Halloween et partagez-le pour convertir des prospects',
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
  medium:
    'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg shadow-yellow-200',
  hard: 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg shadow-red-200'
};

const statusColors = {
  available:
    'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-200',
  in_progress:
    'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg shadow-orange-200',
  completed:
    'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg shadow-green-200',
  locked:
    'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg shadow-gray-200'
};

const rarityColors = {
  common:
    'bg-gradient-to-r from-gray-400 to-slate-500 text-white border-0 shadow-lg shadow-gray-200',
  rare: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg shadow-blue-200',
  epic: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-lg shadow-purple-200',
  legendary:
    'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 shadow-lg shadow-yellow-200'
};

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function ModernBadgeCard({ badge }: { badge: Badge }) {
  const timeLeft = useCountdown(badge.expiresAt || new Date());
  const isExpired = badge.expiresAt && new Date() > badge.expiresAt;

  const rarityStyles = {
    legendary: {
      bg: 'from-amber-400 to-yellow-500',
      border: 'border-amber-300',
      shadow: 'shadow-amber-500/30',
      glow: 'bg-amber-400/20'
    },
    epic: {
      bg: 'from-purple-500 to-violet-600',
      border: 'border-purple-400',
      shadow: 'shadow-purple-500/30',
      glow: 'bg-purple-400/20'
    },
    rare: {
      bg: 'from-blue-500 to-indigo-600',
      border: 'border-blue-400',
      shadow: 'shadow-blue-500/30',
      glow: 'bg-blue-400/20'
    },
    common: {
      bg: 'from-gray-500 to-slate-600',
      border: 'border-gray-400',
      shadow: 'shadow-gray-500/30',
      glow: 'bg-gray-400/20'
    }
  };

  const styles = rarityStyles[badge.rarity];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="group relative cursor-pointer">
          {/* Badge Hexagonal Moderne */}
          <div
            className={`h-14 w-14 rounded-md bg-gradient-to-br ${styles.bg} ${styles.border} ${styles.shadow} animate-modern-float relative flex items-center justify-center border-2 shadow-lg hover:scale-105 ${isExpired ? 'opacity-50 grayscale' : ''} `}
          >
            {/* Glow Effect Subtil */}
            <div
              className={`absolute inset-0 ${styles.glow} animate-subtle-shine`}
            />

            {/* Icône du Badge */}
            <span className="relative z-10 text-xl text-white drop-shadow-lg">
              {badge.icon}
            </span>

            {/* Indicateur de Rareté */}
            <div className="absolute -top-1 -right-1 z-20">
              <div
                className={`h-5 w-5 rounded-full bg-gradient-to-br ${styles.bg} flex items-center justify-center border-2 border-white text-xs font-bold text-white shadow-lg`}
              >
                {badge.rarity === 'legendary' && '♛'}
                {badge.rarity === 'epic' && '♦'}
                {badge.rarity === 'rare' && '★'}
                {badge.rarity === 'common' && '●'}
              </div>
            </div>
          </div>

          {/* Timer Moderne */}
          {badge.isTemporary && badge.expiresAt && !isExpired && (
            <div className="absolute right-0 -bottom-2 left-0 z-30">
              <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 text-center text-xs font-bold text-white shadow-lg">
                {timeLeft.days > 0
                  ? `${timeLeft.days}j`
                  : timeLeft.hours > 0
                    ? `${timeLeft.hours}h`
                    : `${timeLeft.minutes}m`}
              </div>
            </div>
          )}
        </div>
      </HoverCardTrigger>

      {/* Tooltip Moderne et Lisible */}
      <HoverCardContent
        className="w-80 border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-sm"
        side="top"
        align="center"
      >
        <div className="space-y-4">
          {/* Header Clean */}
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <span className="text-3xl">{badge.icon}</span>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900">{badge.name}</h4>
              <div
                className={`mt-1 inline-block rounded-full bg-gradient-to-r px-3 py-1 text-sm font-medium text-white ${styles.bg}`}
              >
                {badge.rarity === 'legendary' && '👑 '}
                {badge.rarity === 'epic' && '💎 '}
                {badge.rarity === 'rare' && '⭐ '}
                {badge.rarity === 'common' && '🏅 '}
                {badge.rarity.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border-l-4 border-gray-300 bg-gray-50 p-3">
            <p className="text-sm leading-relaxed text-gray-700">
              {badge.description}
            </p>
          </div>

          {/* Informations */}
          <div className="flex flex-wrap gap-3">
            <div className="min-w-[140px] flex-1 rounded-lg bg-gray-50 p-3">
              <div className="mb-1 text-xs text-gray-500">Catégorie</div>
              <div className="text-sm font-semibold text-gray-900">
                📂 {badge.category}
              </div>
            </div>
            <div className="min-w-[140px] flex-1 rounded-lg bg-gray-50 p-3">
              <div className="mb-1 text-xs text-gray-500">Obtenu le</div>
              <div className="text-sm font-semibold text-gray-900">
                🎉 {badge.earnedAt.toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>

          {/* Timer Section */}
          {badge.isTemporary && badge.expiresAt && !isExpired && (
            <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-semibold text-orange-700">
                  ⏰ Temps restant
                </div>
                <div className="text-lg font-bold text-orange-800">
                  {timeLeft.days > 0 && `${timeLeft.days}j `}
                  {timeLeft.hours > 0 && `${timeLeft.hours}h `}
                  {timeLeft.minutes}m {timeLeft.seconds}s
                </div>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-orange-200">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((timeLeft.days * 24 * 60 + timeLeft.hours * 60 + timeLeft.minutes) / (7 * 24 * 60)) * 100))}%`
                  }}
                />
              </div>
            </div>
          )}

          {isExpired && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 font-semibold text-red-700">
                <span className="text-lg">⏰</span>
                <span>Ce badge a expiré</span>
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function StickyUserStats() {
  const activeBadges = mockBadges.filter(
    badge =>
      !badge.isTemporary || (badge.expiresAt && new Date() < badge.expiresAt)
  );

  const levelProgress = ((mockStats.currentPoints % 100) / 100) * 100;
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  return (
    <div className="sticky top-0 z-50 border-b-4 border-white/20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl">
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Section Gauche - Stats Principales */}
            <div className="flex items-center gap-4">
              {/* Points */}
              <div className="flex items-center gap-3 rounded-2xl border border-yellow-300/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-5 py-3 backdrop-blur-sm">
                <div className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-3 shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {mockStats.currentPoints}
                  </div>
                  <div className="text-sm font-medium text-yellow-200">
                    Points Gaming
                  </div>
                </div>
              </div>

              {/* Niveau */}
              <div className="flex items-center gap-3 rounded-2xl border border-purple-300/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-5 py-3 backdrop-blur-sm">
                <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-600 p-3 shadow-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white">
                      Niv. {mockStats.currentLevel}
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="h-2 w-20 rounded-full bg-white/30">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                          style={{ width: `${levelProgress}%` }}
                        />
                      </div>
                      <div className="text-center text-xs text-purple-200">
                        {mockStats.nextLevelPoints - mockStats.currentPoints}{' '}
                        pts restants
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Droite - Collection Moderne */}
            <div className="relative">
              {/* Container Principal */}
              <div className="glass-effect modern-grid rounded-2xl px-6 py-4">
                {/* Header Moderne */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 p-3 shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="text-lg font-bold text-white">
                      🏆 Ma Collection
                    </div>
                    <div className="text-sm text-white/80">
                      {activeBadges.length} badges actifs •{' '}
                      {activeBadges.filter(b => b.isTemporary).length}{' '}
                      temporaires
                    </div>
                  </div>

                  {/* Indicateur de progression */}
                  <div className="flex flex-col items-center">
                    <div className="mb-1 h-2 w-16 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="animate-subtle-shift h-full bg-gradient-to-r from-indigo-400 to-blue-500"
                        style={{
                          width: `${Math.min(100, (activeBadges.length / 10) * 100)}%`
                        }}
                      />
                    </div>
                    <div className="text-xs font-medium text-white/70">
                      Collection
                    </div>
                  </div>
                </div>

                {/* Grille de Badges Moderne */}
                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {/* Badges Modernes */}
                    {activeBadges.slice(0, 4).map(badge => (
                      <ModernBadgeCard key={badge.id} badge={badge} />
                    ))}

                    {/* Hub Central pour plus de badges */}
                    <div className="relative flex flex-col items-center">
                      {activeBadges.length > 4 && (
                        <Dialog
                          open={showBadgesModal}
                          onOpenChange={setShowBadgesModal}
                        >
                          <DialogTrigger asChild>
                            <div className="group relative cursor-pointer">
                              <div className="animate-modern-float flex h-16 w-16 items-center justify-center rounded-md border-2 border-indigo-400 bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-110">
                                <div className="animate-subtle-shine absolute inset-0 rounded-md bg-indigo-400/20" />
                                <div className="relative z-10 text-center">
                                  <div className="text-xl font-bold text-white">
                                    +{activeBadges.length - 4}
                                  </div>
                                  <div className="text-xs font-medium text-indigo-200">
                                    PLUS
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogTrigger>

                          {/* Modal Moderne */}
                          <DialogContent className="max-w-5xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-sm">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                                <div className="rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 p-3 shadow-lg">
                                  <Award className="h-6 w-6 text-white" />
                                </div>
                                🏆 Collection Complète
                              </DialogTitle>
                              <DialogDescription className="text-lg text-gray-600">
                                Tous vos {activeBadges.length} badges actifs
                              </DialogDescription>
                            </DialogHeader>

                            {/* Grille de tous les badges */}
                            <div className="mt-6">
                              <div className="modern-grid rounded-xl bg-gray-50 p-6">
                                <div className="flex max-h-[60vh] flex-wrap justify-center gap-4 overflow-y-auto">
                                  {activeBadges.map(badge => (
                                    <div key={badge.id}>
                                      <ModernBadgeCard badge={badge} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Statistiques */}
                            <div className="mt-6 border-t border-gray-200 pt-4">
                              <div className="flex flex-wrap justify-center gap-4">
                                {[
                                  {
                                    count: activeBadges.filter(
                                      b => b.rarity === 'legendary'
                                    ).length,
                                    label: '👑 Legendary',
                                    color: 'text-amber-600'
                                  },
                                  {
                                    count: activeBadges.filter(
                                      b => b.rarity === 'epic'
                                    ).length,
                                    label: '💎 Epic',
                                    color: 'text-purple-600'
                                  },
                                  {
                                    count: activeBadges.filter(
                                      b => b.rarity === 'rare'
                                    ).length,
                                    label: '⭐ Rare',
                                    color: 'text-blue-600'
                                  },
                                  {
                                    count: activeBadges.filter(
                                      b => b.rarity === 'common'
                                    ).length,
                                    label: '🏅 Common',
                                    color: 'text-gray-600'
                                  }
                                ].map((stat, index) => (
                                  <div
                                    key={index}
                                    className="min-w-[120px] flex-1 rounded-lg bg-gray-50 p-3 text-center"
                                  >
                                    <div
                                      className={`mb-1 text-3xl font-bold ${stat.color}`}
                                    >
                                      {stat.count}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                      {stat.label}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Bouton de fermeture */}
                            <div className="mt-6 flex justify-center">
                              <Button
                                onClick={() => setShowBadgesModal(false)}
                                className="rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-2 text-white shadow-lg hover:from-indigo-600 hover:to-blue-700"
                              >
                                ✨ Fermer
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {/* Slot libre si pas assez de badges */}
                      {activeBadges.length <= 4 && (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-white/30">
                          <div className="text-center text-xs font-medium text-white/50">
                            <div>SLOT</div>
                            <div>LIBRE</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestCard({ quest }: { quest: Quest }) {
  const isActive = quest.status === 'in_progress';
  const isCompleted = quest.status === 'completed';

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isActive ? 'ring-opacity-50 shadow-2xl ring-4 shadow-blue-200 ring-blue-400' : ''} ${isCompleted ? 'ring-opacity-50 shadow-2xl ring-4 shadow-green-200 ring-green-400' : ''} bg-gradient-to-br from-white via-blue-50 to-purple-50`}
    >
      {/* Animated background effect */}
      {isActive && (
        <div className="animate-subtle-shine absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10" />
      )}

      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-lg text-transparent">
              {quest.title}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge
              className={`${difficultyColors[quest.difficulty]} animate-gentle-pulse`}
            >
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

      <CardContent className="relative z-10 space-y-4">
        {/* Progress with glow effect */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              Progression
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent">
              {quest.progress}/{quest.maxProgress}
            </span>
          </div>
          <div className="relative">
            <Progress
              value={(quest.progress / quest.maxProgress) * 100}
              className="h-3 bg-gray-200 shadow-inner"
            />
            <div className="animate-subtle-shine absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20" />
          </div>
        </div>

        {/* Reward with sparkle effect */}
        <div className="border-gradient-to-r relative rounded-xl border-2 bg-gradient-to-r from-yellow-50 from-yellow-200 via-orange-50 to-orange-300 to-red-50 p-4 shadow-lg">
          <div className="absolute top-1 right-1">
            <Sparkles className="animate-gentle-pulse h-4 w-4 text-yellow-500" />
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-2 shadow-lg">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-sm font-bold text-transparent">
              {quest.reward.description}
            </span>
          </div>
        </div>

        {/* Requirements with colorful steps */}
        <div className="space-y-3">
          <span className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Shield className="h-4 w-4 text-blue-500" />
            Étapes de conversion:
          </span>
          <ul className="space-y-2">
            {quest.requirements.map((req, index) => {
              const isCompleted = index < quest.progress;
              const isCurrentStep = index === quest.progress;

              return (
                <li
                  key={index}
                  className={`flex transform items-center gap-3 rounded-lg p-3 transition-all duration-300 ${
                    isCompleted
                      ? 'scale-105 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-lg'
                      : isCurrentStep
                        ? 'animate-gentle-pulse bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 shadow-lg ring-2 ring-blue-300'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 hover:shadow-md'
                  } `}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg'
                        : isCurrentStep
                          ? 'animate-gentle-pulse bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg'
                          : 'bg-gradient-to-r from-gray-300 to-gray-400'
                    } `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : isCurrentStep ? (
                      <Clock className="animate-gentle-pulse h-4 w-4 text-white" />
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
          className={`w-full transform shadow-lg transition-all duration-300 hover:scale-105 ${
            quest.status === 'completed'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-200 hover:from-green-600 hover:to-emerald-700'
              : quest.status === 'in_progress'
                ? 'animate-gentle-pulse bg-gradient-to-r from-blue-500 to-purple-600 shadow-blue-200 hover:from-blue-600 hover:to-purple-700'
                : quest.status === 'available'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-200 hover:from-orange-600 hover:to-red-700'
                  : 'cursor-not-allowed bg-gradient-to-r from-gray-400 to-gray-500'
          } `}
          disabled={quest.status === 'locked' || quest.status === 'completed'}
        >
          <div className="flex items-center gap-2">
            {quest.status === 'completed' && (
              <>
                <Trophy className="h-4 w-4" /> Terminé
              </>
            )}
            {quest.status === 'in_progress' && (
              <>
                <Rocket className="h-4 w-4" /> Continuer
              </>
            )}
            {quest.status === 'available' && (
              <>
                <Flame className="h-4 w-4" /> Commencer
              </>
            )}
            {quest.status === 'locked' && (
              <>
                <Lock className="h-4 w-4" /> Verrouillé
              </>
            )}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}

function RewardCard({ reward }: { reward: Reward }) {
  const isClaimed = reward.status === 'claimed';

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isClaimed ? 'ring-opacity-50 shadow-2xl ring-4 shadow-green-200 ring-green-400' : ''} bg-gradient-to-br from-white via-purple-50 to-pink-50`}
    >
      {/* Rarity glow effect */}
      <div
        className={`absolute inset-0 opacity-20 ${
          reward.rarity === 'legendary'
            ? 'animate-soft-glow bg-gradient-to-r from-yellow-400 to-amber-500'
            : reward.rarity === 'epic'
              ? 'animate-soft-glow bg-gradient-to-r from-purple-500 to-violet-600'
              : reward.rarity === 'rare'
                ? 'animate-subtle-shine bg-gradient-to-r from-blue-500 to-indigo-600'
                : 'bg-gradient-to-r from-gray-400 to-slate-500'
        }`}
      />

      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 shadow-lg ${
                reward.rarity === 'legendary'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                  : reward.rarity === 'epic'
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600'
                    : reward.rarity === 'rare'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      : 'bg-gradient-to-r from-gray-400 to-slate-500'
              }`}
            >
              {reward.rarity === 'legendary' && (
                <Crown className="h-5 w-5 text-white" />
              )}
              {reward.rarity === 'epic' && (
                <Gem className="h-5 w-5 text-white" />
              )}
              {reward.rarity === 'rare' && (
                <Star className="h-5 w-5 text-white" />
              )}
              {reward.rarity === 'common' && (
                <Award className="h-5 w-5 text-white" />
              )}
            </div>
            <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-lg text-transparent">
              {reward.title}
            </CardTitle>
          </div>
          <Badge
            className={`${rarityColors[reward.rarity]} animate-gentle-pulse`}
          >
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

      <CardContent className="relative z-10 space-y-4">
        {reward.claimedAt && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 p-3 shadow-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-bold text-green-800">
              🎉 Réclamé le {reward.claimedAt.toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}

        <Button
          className={`w-full transform shadow-lg transition-all duration-300 hover:scale-105 ${
            reward.status === 'claimed'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-200 hover:from-green-600 hover:to-emerald-700'
              : reward.status === 'available'
                ? 'animate-gentle-pulse bg-gradient-to-r from-purple-500 to-pink-600 shadow-purple-200 hover:from-purple-600 hover:to-pink-700'
                : 'cursor-not-allowed bg-gradient-to-r from-gray-400 to-gray-500'
          } `}
          disabled={reward.status === 'locked' || reward.status === 'claimed'}
          variant={reward.status === 'claimed' ? 'outline' : 'default'}
        >
          <div className="flex items-center gap-2">
            {reward.status === 'claimed' && (
              <>
                <Trophy className="h-4 w-4" /> Réclamé
              </>
            )}
            {reward.status === 'available' && (
              <>
                <Sparkles className="h-4 w-4" /> Réclamer
              </>
            )}
            {reward.status === 'locked' && (
              <>
                <Lock className="h-4 w-4" /> Verrouillé
              </>
            )}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}

export function CreatorAffiliation() {
  const [activeTab, setActiveTab] = useState('overview');
  const affiliateLink = 'https://qards.link/?r=creator123';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Sticky User Stats */}
      <StickyUserStats />

      <div className="space-y-6 p-6">
        {/* Animated Header */}
        <div className="space-y-4 text-center">
          <div className="relative">
            <h1 className="animate-gentle-pulse bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              🎮 Creator Gaming Hub 🎮
            </h1>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="animate-gentle-pulse h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <p className="rounded-lg bg-white/50 p-4 text-lg text-gray-600 shadow-lg backdrop-blur-sm">
            🚀 Créez des sites, partagez-les sur les réseaux sociaux et gagnez
            des commissions sur chaque conversion. Complétez des quêtes épiques
            pour booster vos gains ! ⚡
          </p>
        </div>

        {/* Affiliate Link with glow effect */}
        <Card className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-1 shadow-2xl">
          <div className="rounded-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 shadow-lg">
                  <Share2 className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {"🔗 Votre lien d'affiliation magique"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4 font-mono text-sm shadow-inner">
                  {affiliateLink}
                </div>
                <Button
                  onClick={copyToClipboard}
                  className="transform bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  className="transform bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-700"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Gaming Stats Overview */}
        <div className="flex flex-wrap gap-6">
          <Card className="min-w-[280px] flex-1 transform bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-2xl shadow-blue-200 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                🎯 Clics totaux
              </CardTitle>
              <MousePointer className="animate-gentle-pulse h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockStats.totalClicks.toLocaleString()}
              </div>
              <p className="text-xs text-blue-100">via vos partages épiques</p>
            </CardContent>
          </Card>

          <Card className="min-w-[280px] flex-1 transform bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-200 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                ⚡ Conversions
              </CardTitle>
              <Users className="animate-gentle-pulse h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockStats.totalConversions}
              </div>
              <p className="text-xs text-green-100">
                {mockStats.conversionRate}% taux de conversion
              </p>
            </CardContent>
          </Card>

          <Card className="min-w-[280px] flex-1 transform bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-2xl shadow-yellow-200 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                💰 Gains totaux
              </CardTitle>
              <DollarSign className="animate-gentle-pulse h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockStats.totalEarnings}€
              </div>
              <p className="text-xs text-yellow-100">commissions gagnées</p>
            </CardContent>
          </Card>

          <Card className="min-w-[280px] flex-1 transform bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-200 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                ⭐ Points bonus
              </CardTitle>
              <Star className="animate-gentle-pulse h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockStats.currentPoints}
              </div>
              <p className="text-xs text-purple-100">via les quêtes épiques</p>
            </CardContent>
          </Card>
        </div>

        {/* Gaming Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full flex-wrap gap-1 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-1 shadow-2xl">
            <TabsTrigger
              value="overview"
              className="min-w-[120px] flex-1 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg"
            >
              {"🏠 Vue d'ensemble"}
            </TabsTrigger>
            <TabsTrigger
              value="quests"
              className="min-w-[120px] flex-1 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg"
            >
              🎯 Quêtes
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="min-w-[120px] flex-1 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg"
            >
              🏆 Récompenses
            </TabsTrigger>
            <TabsTrigger
              value="levels"
              className="min-w-[120px] flex-1 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg"
            >
              📈 Niveaux
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="min-w-[120px] flex-1 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg"
            >
              👑 Classement
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="min-w-[120px] flex-1 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg"
            >
              📱 Templates
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="min-w-[120px] flex-1 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg"
            >
              📊 Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              <Card className="border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      🎮 Performance Gaming
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 p-3">
                    <span className="font-medium">🎨 Sites créés</span>
                    <span className="font-bold text-blue-600">
                      {mockStats.sitesCreated}
                    </span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 p-3">
                    <span className="font-medium">📱 Sites partagés</span>
                    <span className="font-bold text-green-600">
                      {mockStats.sitesShared}
                    </span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 p-3">
                    <span className="font-medium">🏆 Quêtes complétées</span>
                    <span className="font-bold text-orange-600">
                      {mockStats.questsCompleted}
                    </span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-3">
                    <span className="font-medium">⚡ Taux de conversion</span>
                    <span className="font-bold text-purple-600">
                      {mockStats.conversionRate}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-white via-green-50 to-blue-50 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Rocket className="h-6 w-6 text-green-600" />
                    <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      🚀 Prochaines missions
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex transform items-center gap-4 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 p-4 shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 p-2 shadow-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-blue-800">
                        🎃 Terminer quête Halloween
                      </div>
                      <div className="text-sm text-blue-600">
                        2 étapes restantes pour la victoire !
                      </div>
                    </div>
                  </div>
                  <div className="flex transform items-center gap-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 p-4 shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-2 shadow-lg">
                      <Share2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-green-800">
                        📱 Partager sur LinkedIn
                      </div>
                      <div className="text-sm text-green-600">
                        Augmentez votre portée épique !
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quests" className="mt-6">
            <div className="flex flex-wrap gap-6">
              {mockQuests.map(quest => (
                <div key={quest.id} className="min-w-[400px] flex-1">
                  <QuestCard quest={quest} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            <div className="flex flex-wrap gap-6">
              {mockRewards.map(reward => (
                <div key={reward.id} className="min-w-[320px] flex-1">
                  <RewardCard reward={reward} />
                </div>
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
    </div>
  );
}
