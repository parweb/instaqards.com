import { MobileBottomNavColorful } from 'components/mobile-bottom-nav-colorful';

export default function TestMobileAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-indigo-100">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">📱</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Menu Mobile App
            </h1>
            <p className="text-gray-600">
              Version application avec menu complet
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100">
              <h2 className="font-bold text-indigo-900 mb-2 flex items-center">
                🎯 Navigation App
              </h2>
              <div className="text-sm text-indigo-800 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span>Vue d'ensemble - Indigo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>Sites - Émeraude</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span>Liens - Cyan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Plus - Menu complet</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-2xl border border-emerald-100">
              <h2 className="font-bold text-emerald-900 mb-2 flex items-center">
                📋 Menu complet inclut
              </h2>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li>• Vue d'ensemble & Sites & Liens</li>
                <li>• Générateur (admin/seller)</li>
                <li>• Affiliation & Paramètres</li>
                <li>• Aide & Support</li>
                <li>• Toutes les fonctions avancées</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-2xl border border-cyan-100">
              <h2 className="font-bold text-cyan-900 mb-2 flex items-center">
                ⚡ Fonctionnalités avancées
              </h2>
              <ul className="text-sm text-cyan-800 space-y-1">
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
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              📊 Dashboard Simulation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-3 rounded-xl text-center">
                <div className="text-2xl font-bold text-indigo-600">12</div>
                <div className="text-xs text-indigo-800">Sites actifs</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl text-center">
                <div className="text-2xl font-bold text-emerald-600">1.2k</div>
                <div className="text-xs text-emerald-800">Visiteurs</div>
              </div>
              <div className="bg-cyan-50 p-3 rounded-xl text-center">
                <div className="text-2xl font-bold text-cyan-600">45</div>
                <div className="text-xs text-cyan-800">Liens</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl text-center">
                <div className="text-2xl font-bold text-purple-600">€89</div>
                <div className="text-xs text-purple-800">Revenus</div>
              </div>
            </div>
          </div>

          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                Fonctionnalité App {i + 1}
              </h3>
              <p className="text-gray-600 text-sm">
                Interface d'application avec menu mobile adaptatif. Le bouton
                "Plus" donne accès à toutes les fonctionnalités avancées dans un
                overlay organisé et coloré.
              </p>
            </div>
          ))}
        </div>
        <div className="h-24"></div> {/* Espace pour le menu mobile */}
      </div>

      {/* Menu mobile en mode app */}
      <MobileBottomNavColorful isMarketing={false} />
    </div>
  );
}
