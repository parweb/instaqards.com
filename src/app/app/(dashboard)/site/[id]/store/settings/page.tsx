export default function SiteStoreSettings() {
  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Paramètres du magasin</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Sauvegarder les modifications
        </button>
      </div>

      {/* Navigation des onglets */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button className="border-b-2 border-blue-500 px-1 py-4 text-sm font-medium text-blue-600">
              Général
            </button>
            <button className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
              Paiement
            </button>
            <button className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
              Livraison
            </button>
            <button className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
              Notifications
            </button>
            <button className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
              SEO
            </button>
          </nav>
        </div>

        {/* Contenu de l'onglet Général */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Informations générales */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Informations générales
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nom du magasin
                    </label>
                    <input
                      type="text"
                      defaultValue="Qards Store"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Boutique officielle de produits Qards et Aldo. Découvrez nos collections uniques de vêtements et accessoires."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      defaultValue="contact@qards.store"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+33 1 23 45 67 89"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Adresse du magasin
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <input
                      type="text"
                      defaultValue="123 Rue de la République"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Code postal
                      </label>
                      <input
                        type="text"
                        defaultValue="75001"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Ville
                      </label>
                      <input
                        type="text"
                        defaultValue="Paris"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Pays
                    </label>
                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                      <option>France</option>
                      <option>Belgique</option>
                      <option>Suisse</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Paramètres du magasin */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Paramètres du magasin
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Devise
                    </label>
                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                      <option>EUR (€)</option>
                      <option>USD ($)</option>
                      <option>CAD ($)</option>
                      <option>CHF (CHF)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Fuseau horaire
                    </label>
                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                      <option>Europe/Paris (UTC+1)</option>
                      <option>Europe/London (UTC+0)</option>
                      <option>America/New_York (UTC-5)</option>
                      <option>America/Montreal (UTC-5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Langue par défaut
                    </label>
                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                      <option>Français</option>
                      <option>English</option>
                      <option>Español</option>
                      <option>Deutsch</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Statut du magasin */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Statut du magasin
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center">
                      <div className="mr-3 h-3 w-3 rounded-full bg-green-400"></div>
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Magasin en ligne
                        </p>
                        <p className="text-sm text-green-700">
                          Votre magasin est accessible au public
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-green-700 hover:text-green-900">
                      Désactiver
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Mode maintenance
                        </p>
                        <p className="text-sm text-gray-500">
                          Afficher une page de maintenance
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Mot de passe requis
                        </p>
                        <p className="text-sm text-gray-500">
                          Protéger l'accès avec un mot de passe
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Domaine personnalisé */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Domaine personnalisé
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      URL actuelle
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        https://
                      </span>
                      <input
                        type="text"
                        defaultValue="qards-store.mystore.com"
                        className="flex-1 rounded-r-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Domaine personnalisé
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        https://
                      </span>
                      <input
                        type="text"
                        placeholder="shop.qards.com"
                        className="flex-1 rounded-r-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Configurez votre propre domaine pour une meilleure image
                      de marque
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex justify-between">
              <button className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                Supprimer le magasin
              </button>
              <div className="space-x-3">
                <button className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Annuler
                </button>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
