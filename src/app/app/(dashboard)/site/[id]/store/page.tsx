import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';
import { db } from 'helpers/db';

export default async function SiteStoreDashboard(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const [site] = await Promise.all([
    db.site.findUnique({
      select: {
        id: true,
        name: true,
        userId: true,
        subdomain: true
      },
      where: { id: decodeURIComponent(params.id) }
    })
  ]);

  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
      {/* En-tête du dashboard */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Boutique
          </h1>
          <p className="text-gray-500">
            Vue d'ensemble de votre magasin en ligne
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Exporter les données</Button>
          <Button>Voir le magasin</Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Revenus aujourd'hui
                </p>
                <p className="text-3xl font-bold text-green-600">€1,247</p>
                <p className="mt-1 text-sm text-green-600">↗ +12% vs hier</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-xl text-green-600">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Commandes</p>
                <p className="text-3xl font-bold text-blue-600">28</p>
                <p className="mt-1 text-sm text-red-600">↘ -3% vs hier</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl text-blue-600">📦</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Visiteurs</p>
                <p className="text-3xl font-bold text-purple-600">142</p>
                <p className="mt-1 text-sm text-green-600">↗ +24% vs hier</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <span className="text-xl text-purple-600">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Taux conversion
                </p>
                <p className="text-3xl font-bold text-orange-600">19.7%</p>
                <p className="mt-1 text-sm text-green-600">↗ +2.1% vs hier</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <span className="text-xl text-orange-600">📈</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et métriques */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Graphique des ventes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle>Revenus des 7 derniers jours</CardTitle>
            <Select defaultValue="7days">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 derniers jours</SelectItem>
                <SelectItem value="30days">30 derniers jours</SelectItem>
                <SelectItem value="3months">3 derniers mois</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {/* Simulation d'un graphique avec des barres */}
            <div className="flex h-40 items-end justify-between space-x-2">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 rounded-t bg-blue-500"
                  style={{ height: '60%' }}
                ></div>
                <span className="mt-2 text-xs text-gray-500">Lun</span>
                <span className="text-xs font-medium">€180</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-8 rounded-t bg-blue-500"
                  style={{ height: '80%' }}
                ></div>
                <span className="mt-2 text-xs text-gray-500">Mar</span>
                <span className="text-xs font-medium">€240</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-8 rounded-t bg-blue-500"
                  style={{ height: '45%' }}
                ></div>
                <span className="mt-2 text-xs text-gray-500">Mer</span>
                <span className="text-xs font-medium">€135</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-8 rounded-t bg-blue-500"
                  style={{ height: '90%' }}
                ></div>
                <span className="mt-2 text-xs text-gray-500">Jeu</span>
                <span className="text-xs font-medium">€270</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-8 rounded-t bg-blue-500"
                  style={{ height: '70%' }}
                ></div>
                <span className="mt-2 text-xs text-gray-500">Ven</span>
                <span className="text-xs font-medium">€210</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-8 rounded-t bg-blue-500"
                  style={{ height: '95%' }}
                ></div>
                <span className="mt-2 text-xs text-gray-500">Sam</span>
                <span className="text-xs font-medium">€285</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-8 rounded-t bg-blue-600"
                  style={{ height: '100%' }}
                ></div>
                <span className="mt-2 text-xs text-gray-500">Dim</span>
                <span className="text-xs font-medium">€300</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top produits */}
        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                  <span className="text-gray-400">📷</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">T-shirt Qards</p>
                  <p className="text-sm text-gray-500">18 ventes</p>
                </div>
                <p className="font-semibold text-green-600">€522</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                  <span className="text-gray-400">📷</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Casquette Aldo</p>
                  <p className="text-sm text-gray-500">12 ventes</p>
                </div>
                <p className="font-semibold text-green-600">€240</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                  <span className="text-gray-400">📷</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Sweat Qards</p>
                  <p className="text-sm text-gray-500">8 ventes</p>
                </div>
                <p className="font-semibold text-green-600">€400</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                  <span className="text-gray-400">📷</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Mug Collection</p>
                  <p className="text-sm text-gray-500">6 ventes</p>
                </div>
                <p className="font-semibold text-green-600">€78</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commandes récentes et alertes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Commandes récentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Commandes récentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Voir toutes
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Card className="border-gray-200">
                <CardContent className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium text-gray-900">#ORD-2024-047</p>
                    <p className="text-sm text-gray-500">
                      Alice Dupont • il y a 5 min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">€58.00</p>
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                      Payée
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium text-gray-900">#ORD-2024-046</p>
                    <p className="text-sm text-gray-500">
                      Bob Martin • il y a 12 min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">€29.99</p>
                    <span className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                      En attente
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium text-gray-900">#ORD-2024-045</p>
                    <p className="text-sm text-gray-500">
                      Claire Leroy • il y a 28 min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">€87.50</p>
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                      Expédiée
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Alertes et notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="flex items-start gap-3 p-3">
                  <span className="text-lg text-red-500">⚠️</span>
                  <div>
                    <p className="font-medium text-red-900">Stock faible</p>
                    <p className="text-sm text-red-700">
                      3 produits ont un stock inférieur à 5 unités
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="flex items-start gap-3 p-3">
                  <span className="text-lg text-orange-500">⏳</span>
                  <div>
                    <p className="font-medium text-orange-900">
                      Commandes en attente
                    </p>
                    <p className="text-sm text-orange-700">
                      5 commandes nécessitent votre attention
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="flex items-start gap-3 p-3">
                  <span className="text-lg text-blue-500">📊</span>
                  <div>
                    <p className="font-medium text-blue-900">
                      Nouvelle analyse
                    </p>
                    <p className="text-sm text-blue-700">
                      Rapport de performance mensuel disponible
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="flex items-start gap-3 p-3">
                  <span className="text-lg text-green-500">✅</span>
                  <div>
                    <p className="font-medium text-green-900">
                      Objectif atteint
                    </p>
                    <p className="text-sm text-green-700">
                      Félicitations ! Vous avez atteint 120% de vos ventes
                      mensuelles
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="flex h-20 flex-col items-center gap-2"
            >
              <span className="text-2xl">➕</span>
              <span className="text-sm font-medium">Ajouter un produit</span>
            </Button>

            <Button
              variant="outline"
              className="flex h-20 flex-col items-center gap-2"
            >
              <span className="text-2xl">📦</span>
              <span className="text-sm font-medium">Gérer les commandes</span>
            </Button>

            <Button
              variant="outline"
              className="flex h-20 flex-col items-center gap-2"
            >
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium">Voir les statistiques</span>
            </Button>

            <Button
              variant="outline"
              className="flex h-20 flex-col items-center gap-2"
            >
              <span className="text-2xl">⚙️</span>
              <span className="text-sm font-medium">Paramètres</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
