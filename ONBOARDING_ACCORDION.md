# Système d'Accordéon d'Onboarding avec Gestion des Cookies

## Vue d'ensemble

Ce système implémente un accordéon d'onboarding qui se comporte différemment selon si l'utilisateur visite la page pour la première fois ou non :

- **Première visite** : L'accordéon est ouvert par défaut
- **Visites suivantes** : L'accordéon est fermé par défaut (grâce à un cookie)

## Fichiers créés/modifiés

### 1. Hook personnalisé : `src/hooks/use-onboarding-accordion.ts`

Ce hook gère la logique de l'accordéon et du cookie :

```typescript
export function useOnboardingAccordion() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Logique de vérification du cookie et d'état initial
  // Fonctions pour toggle et reset
}
```

**Fonctionnalités :**

- Vérification automatique du cookie `onboarding-accordion-visited`
- État de chargement pour éviter les flashs
- Fonction `toggleAccordion()` pour ouvrir/fermer
- Fonction `resetCookie()` pour réinitialiser (utile pour les tests)

### 2. Composant Accordéon : `src/components/OnboardingAccordion.tsx`

Composant réutilisable qui encapsule le contenu d'onboarding :

```typescript
interface OnboardingAccordionProps {
  children: React.ReactNode;
  startText?: string;
  titleText?: string;
  subtitleText?: string;
}
```

**Fonctionnalités :**

- Header toujours visible avec textes personnalisables
- Animation fluide d'ouverture/fermeture avec Framer Motion
- Skeleton de chargement pendant l'initialisation
- Icône de chevron qui tourne selon l'état

### 3. Intégration dans la page principale : `src/app/app/(dashboard)/page.tsx`

Remplacement de l'ancienne section onboarding par le nouveau composant accordéon :

```typescript
<OnboardingAccordion
  startText={await translate('components.site.presence.start')}
  titleText={await translate('components.site.presence.title')}
  subtitleText={await translate('components.site.presence.subtitle')}
>
  <OnboardingSteps steps={steps} />
  <ProgressBar value={percent} />
  <OnboardingChecklist state={checklistState} />
</OnboardingAccordion>
```

### 4. Page de test : `src/app/test-accordion/page.tsx`

Page de démonstration pour tester le fonctionnement de l'accordéon.

## Gestion des cookies

### Cookie utilisé

- **Nom** : `onboarding-accordion-visited`
- **Valeur** : `true`
- **Durée** : 1 an
- **Path** : `/` (disponible sur tout le site)

### Logique

1. Au premier chargement, vérification de l'existence du cookie
2. Si absent → première visite → accordéon ouvert + création du cookie
3. Si présent → visite ultérieure → accordéon fermé

## Animations

Utilisation de **Framer Motion** pour des animations fluides :

- **Ouverture/Fermeture** : Animation de hauteur et opacité
- **Icône chevron** : Rotation de 180° selon l'état
- **Durée** : 300ms avec easing `easeInOut`

## Test et débogage

### Page de test

Visitez `/test-accordion` pour tester le système :

1. Première visite → accordéon ouvert
2. Clic sur header → fermeture
3. Refresh → reste fermé
4. Bouton "Réinitialiser" → simule première visite

### Vérification du cookie

Dans les outils de développement :

1. F12 → Application → Cookies
2. Chercher `onboarding-accordion-visited`

### Réinitialisation manuelle

```javascript
// Dans la console du navigateur
document.cookie =
  'onboarding-accordion-visited=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
location.reload();
```

## Avantages de cette approche

1. **UX améliorée** : Évite de montrer l'onboarding à chaque visite
2. **Performance** : Contenu réduit pour les utilisateurs récurrents
3. **Flexibilité** : Facilement personnalisable et réutilisable
4. **Accessibilité** : Header toujours visible, contenu optionnel
5. **Animations fluides** : Transitions agréables avec Framer Motion

## Utilisation dans d'autres pages

Le composant est réutilisable :

```typescript
import { OnboardingAccordion } from 'components/OnboardingAccordion';

<OnboardingAccordion
  startText="Votre texte de badge"
  titleText="Votre titre"
  subtitleText="Votre sous-titre"
>
  {/* Votre contenu d'onboarding */}
</OnboardingAccordion>
```

## Notes techniques

- **SSR Compatible** : Le hook gère l'hydratation côté client
- **TypeScript** : Entièrement typé
- **Responsive** : Fonctionne sur mobile et desktop
- **Dark mode** : Support du thème sombre
- **Performance** : Lazy loading du contenu accordéon
