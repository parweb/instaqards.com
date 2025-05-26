'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Eye, 
  MousePointer,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

interface EarningsHistory {
  id: string;
  date: Date;
  type: 'commission' | 'bonus' | 'quest_reward';
  amount: number;
  description: string;
  questId?: string;
  clientName?: string;
}

interface PerformanceMetric {
  period: string;
  sitesCreated: number;
  sitesShared: number;
  totalClicks: number;
  conversions: number;
  earnings: number;
  points: number;
  conversionRate: number;
}

// Fake data
const mockEarningsHistory: EarningsHistory[] = [
  {
    id: '1',
    date: new Date('2024-01-20'),
    type: 'commission',
    amount: 45.50,
    description: 'Commission site restaurant "Le Petit Bistro"',
    clientName: 'Le Petit Bistro'
  },
  {
    id: '2',
    date: new Date('2024-01-18'),
    type: 'quest_reward',
    amount: 25.00,
    description: 'Récompense quête "Site Saint-Valentin"',
    questId: 'valentine-2024'
  },
  {
    id: '3',
    date: new Date('2024-01-15'),
    type: 'bonus',
    amount: 15.00,
    description: 'Bonus partage réseaux sociaux',
  },
  {
    id: '4',
    date: new Date('2024-01-12'),
    type: 'commission',
    amount: 67.25,
    description: 'Commission site coiffeur "Style & Co"',
    clientName: 'Style & Co'
  },
  {
    id: '5',
    date: new Date('2024-01-10'),
    type: 'quest_reward',
    amount: 18.00,
    description: 'Récompense quête "Modification Lead"',
    questId: 'lead-mod-2024'
  }
];

const mockPerformanceData: PerformanceMetric[] = [
  {
    period: 'Cette semaine',
    sitesCreated: 2,
    sitesShared: 2,
    totalClicks: 156,
    conversions: 1,
    earnings: 45.50,
    points: 12,
    conversionRate: 0.6
  },
  {
    period: 'Semaine dernière',
    sitesCreated: 1,
    sitesShared: 1,
    totalClicks: 89,
    conversions: 0,
    earnings: 25.00,
    points: 8,
    conversionRate: 0.0
  },
  {
    period: 'Ce mois',
    sitesCreated: 4,
    sitesShared: 4,
    totalClicks: 567,
    conversions: 3,
    earnings: 170.75,
    points: 35,
    conversionRate: 0.5
  },
  {
    period: 'Mois dernier',
    sitesCreated: 3,
    sitesShared: 3,
    totalClicks: 423,
    conversions: 2,
    earnings: 134.50,
    points: 28,
    conversionRate: 0.5
  }
];

const getEarningTypeIcon = (type: string) => {
  switch (type) {
    case 'commission':
      return <DollarSign className="h-4 w-4 text-green-600" />;
    case 'quest_reward':
      return <Target className="h-4 w-4 text-blue-600" />;
    case 'bonus':
      return <Star className="h-4 w-4 text-yellow-600" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

const getEarningTypeColor = (type: string) => {
  switch (type) {
    case 'commission':
      return 'bg-green-100 text-green-800';
    case 'quest_reward':
      return 'bg-blue-100 text-blue-800';
    case 'bonus':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getEarningTypeLabel = (type: string) => {
  switch (type) {
    case 'commission':
      return 'Commission';
    case 'quest_reward':
      return 'Quête';
    case 'bonus':
      return 'Bonus';
    default:
      return 'Autre';
  }
};

export function CreatorAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const totalEarnings = mockEarningsHistory.reduce((sum, earning) => sum + earning.amount, 0);
  const thisMonthEarnings = mockPerformanceData.find(p => p.period === 'Ce mois')?.earnings || 0;
  const lastMonthEarnings = mockPerformanceData.find(p => p.period === 'Mois dernier')?.earnings || 0;
  const earningsGrowth = lastMonthEarnings > 0 ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Analytics & Historique
          </CardTitle>
          <CardDescription>
            Suivez vos performances et l'évolution de vos gains
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gains totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toFixed(2)}€</div>
            <div className="flex items-center gap-1 text-xs">
              {earningsGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={earningsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(earningsGrowth).toFixed(1)}% vs mois dernier
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(mockPerformanceData.find(p => p.period === 'Ce mois')?.conversionRate || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              3 conversions ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites créés</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPerformanceData.find(p => p.period === 'Ce mois')?.sitesCreated || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clics générés</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPerformanceData.find(p => p.period === 'Ce mois')?.totalClicks || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              via vos partages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs pour différentes vues */}
      <Tabs defaultValue="earnings">
        <TabsList>
          <TabsTrigger value="earnings">Historique des gains</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des gains</CardTitle>
              <CardDescription>
                Détail de tous vos gains par date et type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEarningsHistory.map(earning => (
                  <div key={earning.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                      {getEarningTypeIcon(earning.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{earning.description}</h4>
                        <Badge className={getEarningTypeColor(earning.type)}>
                          {getEarningTypeLabel(earning.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {earning.date.toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        +{earning.amount.toFixed(2)}€
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockPerformanceData.map(metric => (
              <Card key={metric.period}>
                <CardHeader>
                  <CardTitle className="text-lg">{metric.period}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Sites créés</p>
                      <p className="text-2xl font-bold">{metric.sitesCreated}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Sites partagés</p>
                      <p className="text-2xl font-bold">{metric.sitesShared}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Clics totaux</p>
                      <p className="text-2xl font-bold">{metric.totalClicks}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Conversions</p>
                      <p className="text-2xl font-bold">{metric.conversions}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Gains</span>
                      <span className="text-xl font-bold text-green-600">
                        {metric.earnings.toFixed(2)}€
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-500">Points</span>
                      <span className="text-lg font-bold text-blue-600">
                        {metric.points} pts
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-500">Taux conversion</span>
                      <span className="text-lg font-bold">
                        {metric.conversionRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Conseils d'amélioration */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">💡 Conseils pour améliorer vos performances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-blue-700">
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2" />
            <span className="text-sm">Partagez vos sites sur plusieurs réseaux sociaux pour maximiser les clics</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2" />
            <span className="text-sm">Utilisez les templates de partage optimisés pour chaque plateforme</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2" />
            <span className="text-sm">Complétez les quêtes pour débloquer des bonus de commission</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2" />
            <span className="text-sm">Interagissez avec les commentaires pour augmenter l'engagement</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 