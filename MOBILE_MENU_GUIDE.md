# 📱 Guide du Menu Mobile - qards.link

## 🎯 Vue d'ensemble

Le menu mobile bottom navigation offre une expérience utilisateur moderne et intuitive pour naviguer sur votre site qards.link depuis un appareil mobile.

## 🚀 Fonctionnalités

### ✨ **Fonctionnalités de base**

- **Navigation fixe en bas** - Toujours accessible
- **Détection automatique mobile/desktop** - S'affiche uniquement sur mobile
- **Animations fluides** - Transitions et micro-interactions
- **Vibration tactile** - Feedback haptique sur les appareils compatibles
- **Safe Area** - Compatible avec les encoches des téléphones

### 🎨 **Fonctionnalités avancées**

- **Auto-hide au scroll** - Se masque lors du scroll vers le bas
- **Badges de notification** - Affichage des nouveaux éléments
- **États visuels** - Indicateurs de page active
- **Backdrop blur** - Effet de flou d'arrière-plan moderne

## 📋 Composants

### 1. **MobileBottomNav** (Version de base)

```tsx
import { MobileBottomNav } from 'components/mobile-bottom-nav';

// Usage dans un layout marketing
<MobileBottomNav isMarketing />

// Usage dans un layout d'application
<MobileBottomNav />
```

### 2. **MobileBottomNavEnhanced** (Version avancée)

```tsx
import { MobileBottomNavEnhanced } from 'components/mobile-bottom-nav-enhanced';

// Avec support des notifications
<MobileBottomNavEnhanced isMarketing={false} sites={sites} />;
```

### 3. **MobileBottomNavBadge** (Badges de notification)

```tsx
import { MobileBottomNavBadge } from 'components/mobile-bottom-nav-badge';

<MobileBottomNavBadge count={5} show />
<MobileBottomNavBadge show /> // Point rouge sans nombre
```

## 🎯 Navigation adaptative

### **Mode Marketing** (`isMarketing={true}`)

- 🏠 **Accueil** - Page d'accueil
- 🔍 **Explorer** - Découvrir les qards
- 🎴 **Qards** - Qards du mois (icône personnalisée)
- ⚡ **Créer** - Créer une nouvelle qard

### **Mode Application** (`isMarketing={false}`)

#### Navigation principale :

- 📊 **Vue d'ensemble** - Dashboard principal
- 🌐 **Sites** - Gestion des sites
- 🔗 **Liens** - Gestion des liens
- ⚙️ **Paramètres** - Configuration

#### Navigation contextuelle (dans un site) :

- 🎨 **Design** - Édition du site
- 👥 **Abonnés** - Gestion des abonnés
- 📈 **Analytics** - Statistiques
- ⚙️ **Paramètres** - Configuration du site

## 🔧 Personnalisation

### **Couleurs et thème**

```css
/* Dans globals.css */
.mobile-nav-active {
  @apply text-blue-600 bg-blue-50;
}

.mobile-nav-inactive {
  @apply text-gray-600 hover:text-gray-900;
}
```

### **Animations personnalisées**

```tsx
// Modifier les classes dans le composant
className={cn(
  'transition-all duration-200',
  isActive ? 'scale-105 text-blue-600' : 'scale-100'
)}
```

### **Icônes personnalisées**

```tsx
// Créer une nouvelle icône dans components/icons/
import { CustomIcon } from 'components/icons/custom-icon';

// L'utiliser dans les tabs
icon: <CustomIcon className="w-5 h-5" />;
```

## 📱 Responsive Design

### **Breakpoints**

- **Mobile** : `< 768px` - Menu visible
- **Desktop** : `≥ 768px` - Menu masqué

### **Safe Area**

```css
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## 🔔 Système de notifications

### **Hook personnalisé**

```tsx
import { useMobileNavNotifications } from 'hooks/use-mobile-nav-notifications';

const notifications = useMobileNavNotifications(sites, isMarketing);
// Retourne : { subscribers?: number, analytics?: number, ... }
```

### **Logique des notifications**

- **Nouveaux abonnés** : Comptés sur les dernières 24h
- **Nouvelles données analytics** : Sites avec clics récents
- **Badges automatiques** : Affichage conditionnel

## 🎨 Styles CSS

### **Variables CSS personnalisées**

```css
:root {
  --mobile-nav-height: 80px;
  --mobile-nav-blur: 12px;
  --mobile-nav-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}
```

### **Classes utilitaires**

```css
/* Espacement pour le contenu */
@media (max-width: 768px) {
  body {
    padding-bottom: 80px;
  }
}

/* Effet de flou */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
```

## 🚀 Intégration

### **1. Layout Marketing**

```tsx
// src/app/(marketing)/layout.tsx
import { MobileBottomNav } from 'components/mobile-bottom-nav';

export default function MarketingLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
      <MobileBottomNav isMarketing />
    </div>
  );
}
```

### **2. Layout Application**

```tsx
// src/app/app/(dashboard)/layout.tsx
import { MobileBottomNavEnhanced } from 'components/mobile-bottom-nav-enhanced';

export default function DashboardLayout({ children }) {
  // ... récupération des sites

  return (
    <SidebarProvider>
      {/* ... contenu */}
      <MobileBottomNavEnhanced sites={sites} />
    </SidebarProvider>
  );
}
```

## 🔍 Debugging

### **Tester sur mobile**

1. Ouvrir les DevTools (F12)
2. Activer le mode responsive (Ctrl+Shift+M)
3. Sélectionner un appareil mobile
4. Tester la navigation

### **Vérifier les notifications**

```tsx
// Ajouter des logs temporaires
console.log('Notifications:', notifications);
console.log('Sites data:', sites);
```

## 🎯 Bonnes pratiques

### **Performance**

- ✅ Utiliser `useMemo` pour les calculs coûteux
- ✅ Éviter les re-renders inutiles
- ✅ Lazy loading des icônes si nécessaire

### **Accessibilité**

- ✅ Labels ARIA appropriés
- ✅ Navigation au clavier
- ✅ Contraste suffisant

### **UX**

- ✅ Feedback visuel immédiat
- ✅ Animations fluides (< 300ms)
- ✅ États de chargement si nécessaire

## 🔮 Évolutions futures

### **Fonctionnalités à ajouter**

- [ ] Mode sombre automatique
- [ ] Gestures de swipe
- [ ] Notifications push
- [ ] Personnalisation utilisateur
- [ ] Analytics d'utilisation

### **Optimisations**

- [ ] Préchargement des pages
- [ ] Cache des icônes
- [ ] Compression des animations
- [ ] PWA integration

---

**Créé pour qards.link** 🎴✨
