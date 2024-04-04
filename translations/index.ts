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
  },
  'actions.new-password.token.missing': {
    fr: 'Jeton manquant !',
    en: 'Missing token!'
  },
  'actions.new-password.field.error': {
    fr: 'Champs invalides !',
    en: 'Invalid fields!'
  },
  'actions.new-password.token.error': {
    fr: 'Jeton invalide !',
    en: 'Invalid token!'
  },
  'actions.new-password.token.expire': {
    fr: 'Le jeton a expiré !',
    en: 'Token has expired!'
  },
  'actions.new-password.email.error': {
    fr: "L'email n'existe pas !",
    en: 'Email does not exist!'
  },
  'actions.new-password.password.form.success': {
    fr: 'Mot de passe mis à jour !',
    en: 'Password updated!'
  },
  'actions.new-verification.token.error': {
    fr: "Le jeton n'existe pas !",
    en: 'Token does not exist!'
  },
  'actions.new-verification.token.expire': {
    fr: 'Le jeton a expiré !',
    en: 'Token has expired!'
  },
  'actions.new-verification.email.error': {
    fr: "L'email n'existe pas !",
    en: 'Email does not exist!'
  },
  'actions.new-verification.email.form.success': {
    fr: 'Email vérifié !',
    en: 'Email verified!'
  },
  'actions.register.field.error': {
    fr: 'Champs invalide !',
    en: 'Invalid fields!'
  },
  'actions.register.email.error': {
    fr: 'Email déjà utilisé !',
    en: 'Email already in use!'
  },
  'actions.register.form.success': {
    fr: 'Email de confirmation envoyé !',
    en: 'Confirmation email sent!'
  },
  'actions.reset.email.error': {
    fr: 'Email invalide !',
    en: 'Invalid email!'
  },
  'actions.reset.email.not-found': {
    fr: 'Email non trouvé !',
    en: 'Email not found!'
  },
  'actions.reset.form.success': {
    fr: 'Email de réinitialisation envoyé !',
    en: 'Reset email sent!'
  },
  'actions.settings.unauthorized': {
    fr: 'Non autorisé',
    en: 'Unauthorized'
  },
  'actions.settings.email.error': {
    fr: 'Email déjà utilisé !',
    en: 'Email already in use!'
  },
  'actions.settings.email.success': {
    fr: 'Email déjà utilisé !',
    en: 'Verification email sent!'
  },
  'actions.settings.password.error': {
    fr: 'Mot de passe incorrect !',
    en: 'Incorrect password!'
  },
  'actions.settings.form.success': {
    fr: 'Paramètres mis à jour !',
    en: 'Settings Updated!'
  }
} as const;

export const DEFAULT_LANG: Lang = 'fr';

export default translations;

export type Part = keyof typeof translations;
export type Lang = keyof (typeof translations)[keyof typeof translations];
