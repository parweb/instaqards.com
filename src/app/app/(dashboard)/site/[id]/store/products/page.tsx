export default function SiteStoreProducts() {
  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Gestion des produits</h1>
        <div className="flex gap-2">
          <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option>Toutes les catégories</option>
            <option>T-shirts</option>
            <option>Casquettes</option>
            <option>Sweats</option>
            <option>Accessoires</option>
          </select>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-48 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            + Ajouter un produit
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total produits</p>
              <p className="text-2xl font-semibold">47</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <span className="text-xl text-purple-600">📱</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En stock</p>
              <p className="text-2xl font-semibold text-green-600">42</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <span className="text-xl text-green-600">✅</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Stock faible</p>
              <p className="text-2xl font-semibold text-orange-600">3</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <span className="text-xl text-orange-600">⚠️</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rupture de stock</p>
              <p className="text-2xl font-semibold text-red-600">2</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <span className="text-xl text-red-600">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grille des produits */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Produit 1 */}
          <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
            <div className="flex h-48 items-center justify-center bg-gray-100">
              <span className="text-4xl text-gray-400">📷</span>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold text-gray-900">
                T-shirt Qards Original
              </h3>
              <p className="mb-2 text-sm text-gray-500">Catégorie: T-shirts</p>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">€29.99</span>
                <span className="text-sm text-gray-500">Stock: 15</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">
                  Modifier
                </button>
                <button className="flex-1 rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200">
                  Dupliquer
                </button>
              </div>
            </div>
          </div>

          {/* Produit 2 */}
          <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
            <div className="flex h-48 items-center justify-center bg-gray-100">
              <span className="text-4xl text-gray-400">📷</span>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold text-gray-900">
                Casquette Aldo Premium
              </h3>
              <p className="mb-2 text-sm text-gray-500">
                Catégorie: Casquettes
              </p>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">€19.99</span>
                <span className="text-sm text-orange-500">Stock: 3</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">
                  Modifier
                </button>
                <button className="flex-1 rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200">
                  Dupliquer
                </button>
              </div>
            </div>
          </div>

          {/* Produit 3 */}
          <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
            <div className="flex h-48 items-center justify-center bg-gray-100">
              <span className="text-4xl text-gray-400">📷</span>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold text-gray-900">
                Sweat à capuche Qards
              </h3>
              <p className="mb-2 text-sm text-gray-500">Catégorie: Sweats</p>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">€49.99</span>
                <span className="text-sm text-green-500">Stock: 28</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">
                  Modifier
                </button>
                <button className="flex-1 rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200">
                  Dupliquer
                </button>
              </div>
            </div>
          </div>

          {/* Produit 4 */}
          <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
            <div className="flex h-48 items-center justify-center bg-gray-100">
              <span className="text-4xl text-gray-400">📷</span>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold text-gray-900">
                Stickers Pack Aldo
              </h3>
              <p className="mb-2 text-sm text-gray-500">
                Catégorie: Accessoires
              </p>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">€4.99</span>
                <span className="text-sm text-red-500">Rupture</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">
                  Modifier
                </button>
                <button className="flex-1 rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200">
                  Dupliquer
                </button>
              </div>
            </div>
          </div>

          {/* Produit 5 */}
          <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
            <div className="flex h-48 items-center justify-center bg-gray-100">
              <span className="text-4xl text-gray-400">📷</span>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold text-gray-900">
                Polo Qards Business
              </h3>
              <p className="mb-2 text-sm text-gray-500">Catégorie: T-shirts</p>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">€39.99</span>
                <span className="text-sm text-green-500">Stock: 12</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">
                  Modifier
                </button>
                <button className="flex-1 rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200">
                  Dupliquer
                </button>
              </div>
            </div>
          </div>

          {/* Produit 6 */}
          <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
            <div className="flex h-48 items-center justify-center bg-gray-100">
              <span className="text-4xl text-gray-400">📷</span>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold text-gray-900">
                Mug Aldo Collection
              </h3>
              <p className="mb-2 text-sm text-gray-500">
                Catégorie: Accessoires
              </p>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">€12.99</span>
                <span className="text-sm text-orange-500">Stock: 2</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">
                  Modifier
                </button>
                <button className="flex-1 rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200">
                  Dupliquer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="text-sm text-gray-500">
            Affichage de 1 à 6 sur 47 produits
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
    </div>
  );
}
