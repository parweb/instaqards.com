# Services Creator - Architecture Simplifiée

## 🎯 Vue d'ensemble

Les services Creator remplacent les tables redondantes par des **calculs en temps réel** à partir des données atomiques. Plus simple, plus fiable, toujours cohérent !

## 📦 Services disponibles

### 1. `CreatorService` - Service principal

```typescript
import { creatorService } from '@/lib/services/creator.service';

// Dashboard complet
const dashboard = await creatorService.getCreatorDashboard(userId);

// Ajouter des points
await creatorService.addPoints(userId, 100, 'conversion', 'Lead converti');

// Retirer des points
await creatorService.withdrawPoints(userId, 500, 'Retrait PayPal');
```

### 2. `CreatorQuestService` - Gestion des quêtes

```typescript
import { creatorQuestService } from '@/lib/services/creator-quest.service';

// Démarrer une quête
await creatorQuestService.startQuest(userId, questId);

// Marquer une étape comme complétée
await creatorQuestService.completeQuestStep(userQuestId, stepId);

// Obtenir les quêtes actives avec progression
const activeQuests = await creatorQuestService.getActiveQuests(userId);
```

---

## 🧮 Données calculées vs stockées

### ✅ Ce qui est calculé en temps réel :

| Donnée                 | Calcul                                             | Source                 |
| ---------------------- | -------------------------------------------------- | ---------------------- |
| **Points actuels**     | `SUM(PointsTransaction.amount)`                    | Événements atomiques   |
| **Niveau actuel**      | `CreatorLevel WHERE requiredPoints <= totalPoints` | Configuration + points |
| **Progression niveau** | `(pointsInLevel / pointsNeeded) * 100`             | Calcul mathématique    |
| **Classement**         | `ROW_NUMBER() OVER (ORDER BY points DESC)`         | Agrégation             |
| **Progression quête**  | `completedSteps / totalSteps * 100`                | UserQuestStep          |
| **Stats périodiques**  | `COUNT() WHERE date >= periodStart`                | Filtrage temporel      |

### 📊 Ce qui est stocké (événements atomiques) :

```typescript
// Événements de points
PointsTransaction {
  amount: 100,
  type: 'earned',
  source: 'conversion',
  userId: 'user123',
  createdAt: Date
}

// Conversions réelles
ConversionTracking {
  pointsEarned: 100,
  creatorId: 'user123',
  convertedAt: Date
}

// Participation aux quêtes
UserQuest {
  userId: 'user123',
  questId: 'quest456',
  status: 'COMPLETED',
  completedAt: Date
}
```

---

## 🚀 Exemples d'utilisation

### Dashboard Creator

```typescript
export async function CreatorDashboard({ userId }: { userId: string }) {
  const dashboard = await creatorService.getCreatorDashboard(userId);

  return (
    <div>
      <h1>Points actuels: {dashboard.currentPoints}</h1>
      <p>Niveau: {dashboard.currentLevel?.name}</p>
      <p>Progression: {dashboard.levelProgress}%</p>
      <p>Rang: #{dashboard.leaderboardRank}</p>

      <h2>Cette semaine:</h2>
      <ul>
        <li>{dashboard.weeklyStats.conversions} conversions</li>
        <li>{dashboard.weeklyStats.points} points</li>
        <li>{dashboard.weeklyStats.shares} partages</li>
      </ul>

      <h2>Quêtes actives:</h2>
      {dashboard.activeQuests.map(quest => (
        <div key={quest.id}>
          {quest.title} - {quest.progress}%
        </div>
      ))}
    </div>
  );
}
```

### Système de points

```typescript
// Conversion réussie
await creatorService.addPoints(
  userId,
  100,
  'conversion',
  'Lead restaurant convertie',
  { siteId: 'site123', conversionType: 'lead' }
);

// Partage social
await creatorService.addPoints(userId, 10, 'social_share', 'Partage Facebook', {
  platform: 'facebook',
  postId: 'post123'
});

// Quête complétée (automatique)
await creatorQuestService.completeQuestStep(userQuestId, stepId);
// → Ajoute automatiquement les points de récompense
```

### Leaderboard dynamique

```typescript
const leaderboard = await creatorService.getLeaderboard(10);
// Toujours à jour, pas de cache à maintenir !

leaderboard.forEach(entry => {
  console.log(`#${entry.rank}: ${entry.userName} - ${entry.totalPoints} pts`);
});
```

### Calculs complexes simplifiés

```typescript
// Niveau actuel (calculé instantanément)
const level = await creatorService.getCurrentLevel(userId);

// Progression vers le niveau suivant
const { progress, pointsToNext } =
  await creatorService.getLevelProgress(userId);

// Stats de la semaine
const weeklyStats = await creatorService.getWeeklyStats(userId);
```

---

## ⚡ Performance et optimisation

### Cache recommandé

```typescript
// Cache Redis pour les calculs fréquents
import { cache } from '@/lib/cache';

export async function getCachedCreatorStats(userId: string) {
  return cache.wrap(
    `creator:stats:${userId}`,
    async () => {
      return await creatorService.getCreatorDashboard(userId);
    },
    { ttl: 300 }
  ); // 5 minutes
}
```

### Batch processing

```typescript
// Calculer les stats de plusieurs Creators d'un coup
export async function getBatchCreatorStats(userIds: string[]) {
  return Promise.all(
    userIds.map(userId => creatorService.getCreatorDashboard(userId))
  );
}
```

### Vues matérialisées (optionnel)

```sql
-- Pour les calculs très lourds
CREATE MATERIALIZED VIEW creator_summary AS
SELECT
  u.id,
  u.name,
  SUM(CASE WHEN pt.type = 'earned' THEN pt.amount ELSE 0 END) as total_points,
  COUNT(DISTINCT ct.id) as total_conversions
FROM "User" u
LEFT JOIN "PointsTransaction" pt ON u.id = pt."userId"
LEFT JOIN "ConversionTracking" ct ON u.id = ct."creatorId"
WHERE u.role = 'CREATOR'
GROUP BY u.id, u.name;

-- Refresh périodique
REFRESH MATERIALIZED VIEW creator_summary;
```

---

## 🎯 Migration depuis l'ancien système

### Avant (tables redondantes)

```typescript
// ❌ Données dupliquées, risque de désynchronisation
const userLevel = await prisma.userLevel.findUnique({
  where: { userId }
});

const metrics = await prisma.creatorMetric.findMany({
  where: { userId, period: 'WEEKLY' }
});
```

### Après (calculs purs)

```typescript
// ✅ Toujours cohérent, source unique de vérité
const currentLevel = await creatorService.getCurrentLevel(userId);
const weeklyStats = await creatorService.getWeeklyStats(userId);
```

---

## 🛠️ Développement et tests

### Tests unitaires

```typescript
describe('CreatorService', () => {
  test('should calculate current points correctly', async () => {
    // Créer des transactions de test
    await prisma.pointsTransaction.createMany({
      data: [
        { userId: 'test', amount: 100, type: 'earned', source: 'test' },
        { userId: 'test', amount: 50, type: 'earned', source: 'test' },
        { userId: 'test', amount: -20, type: 'spent', source: 'test' }
      ]
    });

    const points = await creatorService.getCurrentPoints('test');
    expect(points).toBe(130);
  });
});
```

### Debugging

```typescript
// Logger pour tracer les calculs
console.log('Creator stats for:', userId);
console.log('Total earned:', await creatorService.getTotalEarned(userId));
console.log('Current level:', await creatorService.getCurrentLevel(userId));
```

---

## 🎉 Avantages de cette architecture

✅ **Cohérence garantie** : Une seule source de vérité  
✅ **Simplicité** : Moins de tables, moins de bugs  
✅ **Flexibilité** : Facile de changer les règles de calcul  
✅ **Performance** : Optimisé avec cache et index  
✅ **Fiabilité** : Impossible d'avoir des données incohérentes  
✅ **Maintenabilité** : Code plus simple à comprendre

Cette approche transforme votre système Creator en une architecture **event-sourced** moderne et robuste ! 🚀
