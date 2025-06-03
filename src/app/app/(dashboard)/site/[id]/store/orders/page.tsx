export default function SiteStoreOrders() {
  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Gestion des commandes</h1>
        <div className="flex gap-2">
          <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option>Tous les statuts</option>
            <option>En attente</option>
            <option>Confirmée</option>
            <option>Expédiée</option>
            <option>Livrée</option>
            <option>Annulée</option>
          </select>
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-48 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total commandes</p>
              <p className="text-2xl font-semibold">124</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <span className="text-xl text-blue-600">📦</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-semibold text-orange-600">8</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <span className="text-xl text-orange-600">⏳</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expédiées</p>
              <p className="text-2xl font-semibold text-blue-600">15</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <span className="text-xl text-blue-600">🚚</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenu du mois</p>
              <p className="text-2xl font-semibold text-green-600">€3,247</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <span className="text-xl text-green-600">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  N° Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Produits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  #ORD-2024-001
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Alice Dupont</div>
                  <div className="text-sm text-gray-500">alice@example.com</div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  2 articles
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  €58.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                    Livrée
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  12 Jan 2024
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <button className="mr-3 text-blue-600 hover:text-blue-900">
                    Voir
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Imprimer
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  #ORD-2024-002
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Bob Martin</div>
                  <div className="text-sm text-gray-500">bob@example.com</div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  1 article
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  €29.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                    Expédiée
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  11 Jan 2024
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <button className="mr-3 text-blue-600 hover:text-blue-900">
                    Voir
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Imprimer
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  #ORD-2024-003
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Claire Leroy</div>
                  <div className="text-sm text-gray-500">
                    claire@example.com
                  </div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  3 articles
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  €87.50
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                    En attente
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  10 Jan 2024
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <button className="mr-3 text-blue-600 hover:text-blue-900">
                    Voir
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Imprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-lg bg-white px-6 py-3 shadow">
        <div className="text-sm text-gray-500">
          Affichage de 1 à 10 sur 124 commandes
        </div>
        <div className="flex gap-2">
          <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
            Précédent
          </button>
          <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white">
            1
          </button>
          <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
            2
          </button>
          <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
            3
          </button>
          <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
