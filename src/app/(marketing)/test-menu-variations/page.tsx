'use client';

import { useState } from 'react';
import { MenuVariation1 } from 'components/menu-variations/menu-variation-1';
// Most variations are commented out, only keeping the ones that are actually used
import { MenuVariation90 } from 'components/menu-variations/menu-variation-90';
// Only MenuVariation90 is actually used in the menuVariations array

const menuVariations = [
  // Variations originales 1-10
  // {
  //   id: 1,
  //   name: '🌈 Rainbow Gradient',
  //   component: MenuVariation1,
  //   description: 'Menu avec dégradés arc-en-ciel et animations fluides'
  // },
  // {
  //   id: 2,
  //   name: '🌙 Dark Neon',
  //   component: MenuVariation2,
  //   description: 'Thème sombre avec effets néon cyberpunk'
  // },
  // {
  //   id: 3,
  //   name: '🎪 Bouncy Circus',
  //   component: MenuVariation3,
  //   description: 'Animations rebondissantes et couleurs vives'
  // },
  // {
  //   id: 4,
  //   name: '🌊 Ocean Wave',
  //   component: MenuVariation4,
  //   description: 'Thème océan avec vagues et bulles'
  // },
  // {
  //   id: 5,
  //   name: '🔥 Fire Glow',
  //   component: MenuVariation5,
  //   description: 'Effets de feu et lueurs chaudes'
  // },
  // {
  //   id: 6,
  //   name: '❄️ Ice Crystal',
  //   component: MenuVariation6,
  //   description: 'Thème glacé avec cristaux et brillance'
  // },
  // {
  //   id: 7,
  //   name: '🌸 Sakura Bloom',
  //   component: MenuVariation7,
  //   description: 'Thème japonais avec pétales qui tombent'
  // },
  // {
  //   id: 8,
  //   name: '🚀 Space Odyssey',
  //   component: MenuVariation8,
  //   description: 'Thème spatial avec étoiles et galaxies'
  // },
  // {
  //   id: 9,
  //   name: '🎮 Retro Gaming',
  //   component: MenuVariation9,
  //   description: 'Style rétro 8-bit avec pixels'
  // },
  // {
  //   id: 10,
  //   name: '🦄 Unicorn Magic',
  //   component: MenuVariation10,
  //   description: 'Couleurs pastel magiques avec paillettes'
  // },

  // // Nouvelles variations 11-60
  // {
  //   id: 11,
  //   name: '🌋 Volcanic Eruption',
  //   component: MenuVariation11,
  //   description: 'Lave en fusion avec éruptions volcaniques'
  // },
  // {
  //   id: 12,
  //   name: '🌪️ Tornado Storm',
  //   component: MenuVariation12,
  //   description: 'Tourbillons et tempêtes électriques'
  // },
  // {
  //   id: 13,
  //   name: '🎭 Theater Drama',
  //   component: MenuVariation13,
  //   description: 'Rideaux de théâtre avec projecteurs'
  // },
  // {
  //   id: 14,
  //   name: '🏜️ Desert Mirage',
  //   component: MenuVariation14,
  //   description: 'Sable doré avec mirages scintillants'
  // },
  // {
  //   id: 15,
  //   name: '🌿 Forest Mystique',
  //   component: MenuVariation15,
  //   description: 'Forêt enchantée avec lucioles'
  // },
  // {
  //   id: 16,
  //   name: '⚡ Electric Storm',
  //   component: MenuVariation16,
  //   description: 'Éclairs et décharges électriques'
  // },
  // {
  //   id: 17,
  //   name: '🎨 Paint Splash',
  //   component: MenuVariation17,
  //   description: 'Éclaboussures de peinture colorée'
  // },
  // {
  //   id: 18,
  //   name: '🌌 Galaxy Spiral',
  //   component: MenuVariation18,
  //   description: 'Spirales galactiques et nébuleuses'
  // },
  // {
  //   id: 19,
  //   name: '🎵 Music Waves',
  //   component: MenuVariation19,
  //   description: 'Ondes sonores et notes musicales'
  // },
  // {
  //   id: 20,
  //   name: '🔮 Crystal Ball',
  //   component: MenuVariation20,
  //   description: 'Boules de cristal mystiques'
  // },
  // {
  //   id: 21,
  //   name: '🌺 Tropical Paradise',
  //   component: MenuVariation21,
  //   description: 'Plage tropicale avec palmiers'
  // },
  // {
  //   id: 22,
  //   name: '🎯 Target Practice',
  //   component: MenuVariation22,
  //   description: 'Cibles et fléchettes en mouvement'
  // },
  // {
  //   id: 23,
  //   name: '🌙 Lunar Eclipse',
  //   component: MenuVariation23,
  //   description: 'Éclipse lunaire avec phases'
  // },
  // {
  //   id: 24,
  //   name: '🎪 Carnival Lights',
  //   component: MenuVariation24,
  //   description: 'Lumières de fête foraine'
  // },
  // {
  //   id: 25,
  //   name: '🌊 Tsunami Wave',
  //   component: MenuVariation25,
  //   description: 'Vagues géantes déferlantes'
  // },
  // {
  //   id: 26,
  //   name: '🎨 Graffiti Street',
  //   component: MenuVariation26,
  //   description: 'Art urbain et graffitis'
  // },
  // {
  //   id: 27,
  //   name: '🌟 Shooting Stars',
  //   component: MenuVariation27,
  //   description: 'Étoiles filantes et comètes'
  // },
  // {
  //   id: 28,
  //   name: '🎭 Masquerade Ball',
  //   component: MenuVariation28,
  //   description: 'Bal masqué élégant'
  // },
  // {
  //   id: 29,
  //   name: '🌈 Prism Light',
  //   component: MenuVariation29,
  //   description: 'Réfraction prismatique'
  // },
  // {
  //   id: 30,
  //   name: '🎪 Magic Show',
  //   component: MenuVariation30,
  //   description: 'Spectacle de magie avec tours'
  // },
  // {
  //   id: 31,
  //   name: '🌸 Cherry Blossom',
  //   component: MenuVariation31,
  //   description: 'Cerisiers en fleurs japonais'
  // },
  // {
  //   id: 32,
  //   name: '⚡ Tesla Coil',
  //   component: MenuVariation32,
  //   description: 'Bobines Tesla électriques'
  // },
  // {
  //   id: 33,
  //   name: '🌊 Aquarium Deep',
  //   component: MenuVariation33,
  //   description: 'Aquarium avec poissons exotiques'
  // },
  // {
  //   id: 34,
  //   name: '🎨 Watercolor Dream',
  //   component: MenuVariation34,
  //   description: 'Aquarelle fluide et douce'
  // },
  // {
  //   id: 35,
  //   name: '🌟 Disco Fever',
  //   component: MenuVariation35,
  //   description: 'Boule disco et paillettes'
  // },
  // {
  //   id: 36,
  //   name: '🎯 Laser Show',
  //   component: MenuVariation36,
  //   description: 'Spectacle laser coloré'
  // },
  // {
  //   id: 37,
  //   name: '🌙 Night Sky',
  //   component: MenuVariation37,
  //   description: 'Ciel étoilé nocturne'
  // },
  // {
  //   id: 38,
  //   name: '🎪 Ferris Wheel',
  //   component: MenuVariation38,
  //   description: 'Grande roue illuminée'
  // },
  // {
  //   id: 39,
  //   name: '🌊 Coral Reef',
  //   component: MenuVariation39,
  //   description: 'Récif corallien coloré'
  // },
  // {
  //   id: 40,
  //   name: '🎨 Oil Painting',
  //   component: MenuVariation40,
  //   description: "Peinture à l&apos;huile classique"
  // },
  // {
  //   id: 41,
  //   name: '🌟 Supernova',
  //   component: MenuVariation41,
  //   description: 'Explosion stellaire'
  // },
  // {
  //   id: 42,
  //   name: '🎭 Opera House',
  //   component: MenuVariation42,
  //   description: 'Opéra avec balcons dorés'
  // },
  // {
  //   id: 43,
  //   name: '🌈 Aurora Borealis',
  //   component: MenuVariation43,
  //   description: 'Aurores boréales dansantes'
  // },
  // {
  //   id: 44,
  //   name: '🎪 Balloon Festival',
  //   component: MenuVariation44,
  //   description: 'Festival de montgolfières'
  // },
  // {
  //   id: 45,
  //   name: '🌊 Whirlpool',
  //   component: MenuVariation45,
  //   description: 'Tourbillons aquatiques'
  // },
  // {
  //   id: 46,
  //   name: '🎨 Mosaic Art',
  //   component: MenuVariation46,
  //   description: 'Mosaïque byzantine'
  // },
  // {
  //   id: 47,
  //   name: '🌟 Constellation',
  //   component: MenuVariation47,
  //   description: 'Constellations animées'
  // },
  // {
  //   id: 48,
  //   name: '🎭 Puppet Show',
  //   component: MenuVariation48,
  //   description: 'Spectacle de marionnettes'
  // },
  // {
  //   id: 49,
  //   name: '🌈 Holographic',
  //   component: MenuVariation49,
  //   description: 'Effets holographiques'
  // },
  // {
  //   id: 50,
  //   name: '🎪 Acrobat Circus',
  //   component: MenuVariation50,
  //   description: 'Acrobates voltigeant'
  // },
  // {
  //   id: 51,
  //   name: '🌊 Tidal Pool',
  //   component: MenuVariation51,
  //   description: 'Bassins de marée'
  // },
  // {
  //   id: 52,
  //   name: '🎨 Street Art',
  //   component: MenuVariation52,
  //   description: 'Art de rue moderne'
  // },
  // {
  //   id: 53,
  //   name: '🌟 Meteor Shower',
  //   component: MenuVariation53,
  //   description: 'Pluie de météores'
  // },
  // {
  //   id: 54,
  //   name: '🎭 Kabuki Theater',
  //   component: MenuVariation54,
  //   description: 'Théâtre kabuki japonais'
  // },
  // {
  //   id: 55,
  //   name: '🌈 Soap Bubbles',
  //   component: MenuVariation55,
  //   description: 'Bulles de savon irisées'
  // },
  // {
  //   id: 56,
  //   name: '🎪 Trapeze Artists',
  //   component: MenuVariation56,
  //   description: 'Trapézistes en action'
  // },
  // {
  //   id: 57,
  //   name: '🌊 Jellyfish Dance',
  //   component: MenuVariation57,
  //   description: 'Méduses phosphorescentes'
  // },
  // {
  //   id: 58,
  //   name: '🎨 Digital Glitch',
  //   component: MenuVariation58,
  //   description: 'Glitchs numériques'
  // },
  // {
  //   id: 59,
  //   name: '🌟 Pulsar Beam',
  //   component: MenuVariation59,
  //   description: 'Faisceaux de pulsar'
  // },
  // {
  //   id: 60,
  //   name: '🎭 Final Curtain',
  //   component: MenuVariation60,
  //   description: 'Rideau final spectaculaire'
  // },

  // // Nouvelles variations 61-70
  // {
  //   id: 61,
  //   name: '🌊 Liquid Morphing',
  //   component: MenuVariation61,
  //   description: 'Formes liquides qui se transforment en continu'
  // },
  // {
  //   id: 62,
  //   name: '📐 Origami Fold',
  //   component: MenuVariation62,
  //   description: 'Pliages géométriques comme du papier origami'
  // },
  // {
  //   id: 63,
  //   name: '⚛️ Quantum Particles',
  //   component: MenuVariation63,
  //   description: 'Particules quantiques en superposition'
  // },
  // {
  //   id: 64,
  //   name: '🎵 Vintage Vinyl',
  //   component: MenuVariation64,
  //   description: 'Disques vinyles qui tournent avec style rétro'
  // },
  // {
  //   id: 65,
  //   name: '🌃 Neon Cyberpunk',
  //   component: MenuVariation65,
  //   description: 'Hologrammes néon avec effets de glitch'
  // },
  // {
  //   id: 66,
  //   name: '🫧 Floating Bubbles',
  //   component: MenuVariation66,
  //   description: 'Bulles de savon irisées qui flottent'
  // },
  // {
  //   id: 67,
  //   name: '🧲 Magnetic Field',
  //   component: MenuVariation67,
  //   description: 'Champs magnétiques avec particules métalliques'
  // },
  // {
  //   id: 68,
  //   name: '💎 Crystal Growth',
  //   component: MenuVariation68,
  //   description: 'Cristaux qui poussent avec facettes scintillantes'
  // },
  // {
  //   id: 69,
  //   name: '⚡ Plasma Energy',
  //   component: MenuVariation69,
  //   description: 'Énergie plasma avec décharges électriques'
  // },
  // {
  //   id: 70,
  //   name: '🔄 Morphing Shapes',
  //   component: MenuVariation70,
  //   description: 'Formes géométriques qui se transforment'
  // },

  // // Nouvelles variations avec micro-animations 71-80
  // {
  //   id: 71,
  //   name: '📍 Sliding Indicator',
  //   component: MenuVariation71,
  //   description: 'Indicateur qui glisse fluidement vers le nouvel onglet'
  // },
  // {
  //   id: 72,
  //   name: '🎾 Elastic Bounce',
  //   component: MenuVariation72,
  //   description: 'Rebond élastique avec effet de ressort'
  // },
  // {
  //   id: 73,
  //   name: '🌊 Wave Ripple',
  //   component: MenuVariation73,
  //   description: 'Propagation en vagues avec ondulations'
  // },
  // {
  //   id: 74,
  //   name: '🧲 Magnetic Pull',
  //   component: MenuVariation74,
  //   description: 'Attraction magnétique vers le nouvel onglet'
  // },
  // {
  //   id: 75,
  //   name: '✨ Particle Trail',
  //   component: MenuVariation75,
  //   description: "Traînée de particules qui suivent l&apos;indicateur"
  // },
  // {
  //   id: 76,
  //   name: '🫧 Morphing Blob',
  //   component: MenuVariation76,
  //   description: 'Blob qui se transforme en se déplaçant'
  // },
  // {
  //   id: 77,
  //   name: '🏃 Spring Physics',
  //   component: MenuVariation77,
  //   description: 'Physique de ressort réaliste'
  // },
  // {
  //   id: 78,
  //   name: '💧 Liquid Indicator',
  //   component: MenuVariation78,
  //   description: 'Indicateur qui coule comme un liquide'
  // },
  // {
  //   id: 79,
  //   name: '📡 Pulse Wave',
  //   component: MenuVariation79,
  //   description: 'Ondes de pulsation qui se propagent'
  // },
  // {
  //   id: 80,
  //   name: '🎯 Micro Interactions',
  //   component: MenuVariation80,
  //   description: 'Micro-animations subtiles et physique avancée'
  // },
  // {
  //   id: 81,
  //   name: '✨ Glow Trail',
  //   component: MenuVariation81,
  //   description: 'Traînée lumineuse avec effets de flou et de brillance'
  // },
  // {
  //   id: 82,
  //   name: '🔄 Flip Card',
  //   component: MenuVariation82,
  //   description: 'Animation de carte qui se retourne en 3D'
  // },
  // {
  //   id: 83,
  //   name: '🎊 Confetti Burst',
  //   component: MenuVariation83,
  //   description: 'Explosion de confettis colorés lors du changement'
  // },
  // {
  //   id: 84,
  //   name: '🌫️ Shadow Slide',
  //   component: MenuVariation84,
  //   description: 'Ombres dynamiques multiples qui suivent l\'indicateur'
  // },
  // {
  //   id: 85,
  //   name: '🎨 Color Splash',
  //   component: MenuVariation85,
  //   description: 'Éclaboussures de couleur qui se propagent'
  // },
  // {
  //   id: 86,
  //   name: '⚫ Dot Matrix',
  //   component: MenuVariation86,
  //   description: 'Matrice de points qui s\'illuminent'
  // },
  // {
  //   id: 87,
  //   name: '🔮 Glass Morph',
  //   component: MenuVariation87,
  //   description: 'Effets de verre avec flou et transparence'
  // },
  // {
  //   id: 88,
  //   name: '🌟 Firefly',
  //   component: MenuVariation88,
  //   description: 'Lucioles qui voltigent autour de l\'onglet actif'
  // },
  // {
  //   id: 89,
  //   name: '📡 Radar Pulse',
  //   component: MenuVariation89,
  //   description: 'Ondes radar qui balayent l\'interface'
  // },
  {
    id: 90,
    name: '🎀 Ribbon Sweep',
    component: MenuVariation90,
    description: 'Ruban qui balaie l&apos;interface avec brillance'
  }
  // {
  //   id: 91,
  //   name: '🎤 Voice Command',
  //   component: MenuVariation91,
  //   description: 'Navigation par commandes vocales avec ondes sonores'
  // },
  // {
  //   id: 92,
  //   name: '🌓 Adaptive Theme',
  //   component: MenuVariation92,
  //   description: 'Adaptation automatique au thème système'
  // },
  // {
  //   id: 93,
  //   name: '👆 Gesture Swipe',
  //   component: MenuVariation93,
  //   description: 'Navigation par gestes de balayage tactile'
  // }
];

export default function TestMenuVariationsPage() {
  const [selectedMenu, setSelectedMenu] = useState(1);
  const SelectedComponent =
    menuVariations.find(m => m.id === selectedMenu)?.component ||
    MenuVariation1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-gray-200">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🎨</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Menu Variations Lab
            </h1>
            <p className="text-gray-600">
              93 styles de menus mobiles complètement différents !
            </p>
          </div>

          {/* Sélecteur de menu */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 mb-3">
              Choisissez un style :
            </h3>
            <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto custom-scrollbar">
              {menuVariations.map(menu => (
                <button
                  key={menu.id}
                  onClick={() => setSelectedMenu(menu.id)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 ${
                    selectedMenu === menu.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="font-semibold text-sm">{menu.name}</div>
                  <div
                    className={`text-xs mt-1 ${
                      selectedMenu === menu.id
                        ? 'text-purple-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {menu.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Zone de démonstration */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-center">
            Aperçu : {menuVariations.find(m => m.id === selectedMenu)?.name}
          </h3>
          <div className="text-center text-gray-600 text-sm mb-4">
            {menuVariations.find(m => m.id === selectedMenu)?.description}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
            <h4 className="font-bold text-blue-900 mb-2">📱 Instructions :</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Activez le mode mobile (F12 → Responsive)</li>
              <li>• Le menu apparaît en bas de l&apos;écran</li>
              <li>• Testez les interactions et animations</li>
              <li>• Changez de style avec les boutons ci-dessus</li>
            </ul>
          </div>
        </div>
        {/* Contenu de test */}
        <div className="space-y-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                Section de test {i + 1}
              </h3>
              <p className="text-gray-600 text-sm">
                Contenu de démonstration pour tester le menu sélectionné. Chaque
                variation a ses propres animations, couleurs et effets spéciaux
                !
              </p>
            </div>
          ))}
        </div>
        <div className="h-24"></div> {/* Espace pour le menu mobile */}
      </div>

      {/* Menu mobile sélectionné */}
      <SelectedComponent />
    </div>
  );
}
