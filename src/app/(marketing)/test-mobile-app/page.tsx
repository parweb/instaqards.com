import { MobileBottomNavColorful } from 'components/mobile-bottom-nav-colorful';

export default function TestMobileAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4">
      <div className="mx-auto max-w-md">
        <div className="mb-6 rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl">
          <div className="mb-6 text-center">
            <div className="mb-2 text-4xl">📱</div>
            <h1 className="mb-2 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
              Menu Mobile App
            </h1>
            <p className="text-gray-600">
              Version application avec menu complet
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
              <h2 className="mb-2 flex items-center font-bold text-indigo-900">
                🎯 Navigation App
              </h2>
              <div className="space-y-1 text-sm text-indigo-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                  <span>Vue d&apos;ensemble - Indigo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span>Sites - Émeraude</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-cyan-500"></div>
                  <span>Liens - Cyan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                  <span>Plus - Menu complet</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4">
              <h2 className="mb-2 flex items-center font-bold text-emerald-900">
                📋 Menu complet inclut
              </h2>
              <ul className="space-y-1 text-sm text-emerald-800">
                <li>• Vue d&apos;ensemble & Sites & Liens</li>
                <li>• Générateur (admin/seller)</li>
                <li>• Affiliation & Paramètres</li>
                <li>• Aide & Support</li>
                <li>• Toutes les fonctions avancées</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
              <h2 className="mb-2 flex items-center font-bold text-cyan-900">
                ⚡ Fonctionnalités avancées
              </h2>
              <ul className="space-y-1 text-sm text-cyan-800">
                <li>• Adaptation contextuelle (site spécifique)</li>
                <li>• Overlay avec grille 2 colonnes</li>
                <li>• Couleurs par catégorie</li>
                <li>• Animations et vibrations</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Simulation d'un dashboard */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
            <h3 className="mb-3 flex items-center font-bold text-gray-900">
              📊 Dashboard Simulation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-indigo-50 p-3 text-center">
                <div className="text-2xl font-bold text-indigo-600">12</div>
                <div className="text-xs text-indigo-800">Sites actifs</div>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-center">
                <div className="text-2xl font-bold text-emerald-600">1.2k</div>
                <div className="text-xs text-emerald-800">Visiteurs</div>
              </div>
              <div className="rounded-xl bg-cyan-50 p-3 text-center">
                <div className="text-2xl font-bold text-cyan-600">45</div>
                <div className="text-xs text-cyan-800">Liens</div>
              </div>
              <div className="rounded-xl bg-purple-50 p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">€89</div>
                <div className="text-xs text-purple-800">Revenus</div>
              </div>
            </div>
          </div>

          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg"
            >
              <h3 className="mb-2 font-semibold text-gray-900">
                Fonctionnalité App {i + 1}
              </h3>
              <p className="text-sm text-gray-600">
                Interface d&apos;application avec menu mobile adaptatif. Le
                bouton &quot;Plus&quot; donne accès à toutes les fonctionnalités
                avancées dans un overlay organisé et coloré.
              </p>
            </div>
          ))}
        </div>
        <div className="h-24"></div> {/* Espace pour le menu mobile */}
      </div>

      {/* Menu mobile en mode app */}
      <MobileBottomNavColorful />
    </div>
  );
}
