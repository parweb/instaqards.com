export default function TestMobileColorfulPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-purple-100">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🎨</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Menu Mobile Coloré
            </h1>
            <p className="text-gray-600">
              Version sympathique et colorée avec menu complet
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
              <h2 className="font-bold text-blue-900 mb-2 flex items-center">
                🌈 Couleurs par onglet
              </h2>
              <div className="text-sm text-blue-800 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Accueil - Bleu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Explorer - Vert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Qards - Violet</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Plus - Gris</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
              <h2 className="font-bold text-purple-900 mb-2 flex items-center">
                ✨ Animations simplifiées
              </h2>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• 🎯 Animations uniquement sur bouton &quot;Plus&quot;</li>
                <li>• 🎪 Rotation et spin au clic sur &quot;Plus&quot;</li>
                <li>• ⚡ Vibrations tactiles améliorées</li>
                <li>• 🎨 Overlay modal avec slide-up</li>
                <li>• 🔄 Transitions douces et rapides</li>
                <li>• 🎭 Bouton fermeture avec rotation</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-2xl border border-orange-100">
              <h2 className="font-bold text-orange-900 mb-2 flex items-center">
                🎯 Test du bouton &quot;Plus&quot;
              </h2>
              <p className="text-sm text-orange-800">
                Cliquez sur le dernier onglet &quot;Plus&quot; pour voir
                apparaître le menu complet avec tous les éléments de navigation
                dans un overlay élégant.
              </p>
            </div>
          </div>
        </div>
        {/* Contenu de démonstration */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              🚀 Animations épurées
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                • <strong>Onglets normaux :</strong> Hover scale 105% simple
              </p>
              <p>
                • <strong>Bouton &quot;Plus&quot; :</strong> Hover scale 110% +
                rotation
              </p>
              <p>
                • <strong>Clic &quot;Plus&quot; :</strong> Pulse + spin de
                l&apos;icône
              </p>
              <p>
                • <strong>Modal :</strong> Slide-up fluide avec backdrop
              </p>
              <p>
                • <strong>Fermeture :</strong> Bouton X avec rotation 90°
              </p>
              <p>
                • <strong>Vibration :</strong> Pattern [100,50,100] pour
                &quot;Plus&quot;
              </p>
              <p>
                • <strong>Transitions :</strong> 200ms rapides et fluides
              </p>
            </div>
          </div>

          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                Section colorée {i + 1}
              </h3>
              <p className="text-gray-600 text-sm">
                Contenu de test pour voir le menu en action. Le menu reste fixe
                en bas et s&apos;adapte aux couleurs selon l&apos;onglet actif.
                Testez le bouton &quot;Plus&quot; pour accéder au menu complet !
              </p>
            </div>
          ))}
        </div>
        <div className="h-24"></div> {/* Espace pour le menu mobile */}
      </div>
    </div>
  );
}
