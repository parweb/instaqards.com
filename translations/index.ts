const translations = {
  'actions.admin.success': {
    fr: 'Action serveur authorisez!',
    en: 'Allowed Server Action!'
  },
  'actions.admin.error': {
    fr: 'Action interdite sur le serveur !',
    en: 'Forbidden Server Action!'
  },
  'dashboard.home.title': {
    fr: 'Aperçu',
    en: 'Overview'
  },
  'dashboard.home.top-sites': {
    fr: 'Meilleur sites',
    en: 'Top Sites'
  },
  'component.overview-stats.title': {
    fr: 'Tous les cliques',
    en: 'Total Clicks'
  }
} as const;

export const DEFAULT_LANG: Lang = 'fr';

export default translations;

export type Part = keyof typeof translations;
export type Lang = keyof (typeof translations)[keyof typeof translations];
