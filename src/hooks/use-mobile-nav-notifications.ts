import { useMemo } from 'react';

interface NotificationCounts {
  subscribers?: number;
  analytics?: number;
  sites?: number;
  links?: number;
}

export const useMobileNavNotifications = (
  sites?: any[],
  isMarketing: boolean = false
) => {
  return useMemo(() => {
    if (isMarketing) {
      return {};
    }

    // Calculer les notifications pour l'app
    const notifications: NotificationCounts = {};

    if (sites) {
      // Compter les nouveaux abonnés (exemple)
      const totalNewSubscribers = sites.reduce((acc, site) => {
        return (
          acc +
          (site.subscribers?.filter((sub: any) => {
            const subDate = new Date(sub.createdAt);
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return subDate > dayAgo;
          }).length || 0)
        );
      }, 0);

      if (totalNewSubscribers > 0) {
        notifications.subscribers = totalNewSubscribers;
      }

      // Compter les sites avec de nouvelles données analytics
      const sitesWithNewData = sites.filter(site => {
        const recentClicks =
          site.clicks?.filter((click: any) => {
            const clickDate = new Date(click.createdAt);
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return clickDate > dayAgo;
          }).length || 0;
        return recentClicks > 0;
      }).length;

      if (sitesWithNewData > 0) {
        notifications.analytics = sitesWithNewData;
      }
    }

    return notifications;
  }, [sites, isMarketing]);
};
