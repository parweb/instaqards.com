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
          <button className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            Exporter les données
          </button>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            Voir le magasin
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
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
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
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
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
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
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
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
        </div>
      </div>

      {/* Graphiques et métriques */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Graphique des ventes */}
        <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenus des 7 derniers jours
            </h3>
            <select className="rounded border border-gray-300 px-3 py-1 text-sm">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
              <option>3 derniers mois</option>
            </select>
          </div>

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
        </div>

        {/* Top produits */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Produits populaires
          </h3>
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
        </div>
      </div>

      {/* Commandes récentes et alertes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Commandes récentes */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Commandes récentes
            </h3>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Voir toutes
            </a>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
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
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
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
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
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
            </div>
          </div>
        </div>

        {/* Alertes et notifications */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Alertes importantes
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <span className="text-lg text-red-500">⚠️</span>
              <div>
                <p className="font-medium text-red-900">Stock faible</p>
                <p className="text-sm text-red-700">
                  3 produits ont un stock inférieur à 5 unités
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
              <span className="text-lg text-orange-500">⏳</span>
              <div>
                <p className="font-medium text-orange-900">
                  Commandes en attente
                </p>
                <p className="text-sm text-orange-700">
                  5 commandes nécessitent votre attention
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <span className="text-lg text-blue-500">📊</span>
              <div>
                <p className="font-medium text-blue-900">Nouvelle analyse</p>
                <p className="text-sm text-blue-700">
                  Rapport de performance mensuel disponible
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
              <span className="text-lg text-green-500">✅</span>
              <div>
                <p className="font-medium text-green-900">Objectif atteint</p>
                <p className="text-sm text-green-700">
                  Félicitations ! Vous avez atteint 120% de vos ventes
                  mensuelles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <button className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
            <span className="mb-2 text-2xl">➕</span>
            <span className="text-sm font-medium">Ajouter un produit</span>
          </button>

          <button className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
            <span className="mb-2 text-2xl">📦</span>
            <span className="text-sm font-medium">Gérer les commandes</span>
          </button>

          <button className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
            <span className="mb-2 text-2xl">📊</span>
            <span className="text-sm font-medium">Voir les statistiques</span>
          </button>

          <button className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
            <span className="mb-2 text-2xl">⚙️</span>
            <span className="text-sm font-medium">Paramètres</span>
          </button>
        </div>
      </div>
    </div>
  );
}
