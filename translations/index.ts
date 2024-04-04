const translations = {
  'actions.admin.success': {
    fr: 'Action serveur authorisez!',
    en: 'Allowed Server Action!'
  },
  'actions.admin.error': {
    fr: 'Action interdite sur le serveur !',
    en: 'Forbidden Server Action!'
  },
  'actions.login.validation.error': {
    fr: 'Champs invalide !',
    en: 'Invalid fields!'
  },
  'actions.login.validation.email.error': {
    fr: "L'email n'existe pas !",
    en: 'Email does not exist!'
  },
  'actions.login.validation.form.success': {
    fr: 'Email de confirmation envoyé !',
    en: 'Confirmation email sent!'
  },
  'actions.login.token.error': {
    fr: 'Code invalide !',
    en: 'Invalid code!'
  },
  'actions.login.token.expire': {
    fr: 'Code expiré !',
    en: 'Code expired!'
  },
  'actions.login.credentials.invalid': {
    fr: 'Identifiants invalides !',
    en: 'Invalid credentials!'
  },
  'actions.login.credentials.oops': {
    fr: 'Un problème est survenu !',
    en: 'Something went wrong!'
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
