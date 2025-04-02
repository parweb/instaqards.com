import 'server-only';

import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import { Resend } from 'resend';

import ConfirmAccountEmail from '../../emails/confirm-account';
import MagicLinkEmail from '../../emails/magic-link';
import ResetPasswordEmail from '../../emails/reset-password';
import TwoFactorTokenEmail from '../../emails/two-factor-token';
import WelcomeEmail from '../../emails/welcome';
import { DEFAULT_LANG, type Lang } from 'translations';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = `http://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

const getLang = async () => {
  let lang = (((await cookies()) as unknown as UnsafeUnwrappedCookies).get(
    'lang'
  )?.value ?? DEFAULT_LANG) as Lang;

  switch (true) {
    case lang.toLowerCase().includes('fr'):
      lang = 'fr';
      break;
    case lang.toLowerCase().includes('en'):
      lang = 'en';
      break;
    case lang.toLowerCase().includes('us'):
    case lang.toLowerCase().includes('gb'):
      lang = 'en';
      break;
    case lang.toLowerCase().includes('it'):
      lang = 'it';
      break;
    case lang.toLowerCase().includes('es'):
      lang = 'es';
      break;
    default:
      lang = 'en';
      break;
  }

  return lang;
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const lang = await getLang();

  const subject = {
    en: '2FA Code',
    fr: 'Code 2FA',
    es: 'Código 2FA',
    it: 'Codice 2FA'
  }[lang];

  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject,
    react: <TwoFactorTokenEmail lang={lang} token={token} />
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const lang = await getLang();
  const resetLink = `${domain}/new-password?token=${token}`;

  const subject = {
    en: 'Reset your password',
    fr: 'Réinitialiser votre mot de passe',
    es: 'Restablecer tu contraseña',
    it: 'Reimposta la tua password'
  }[lang];

  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject,
    react: <ResetPasswordEmail lang={lang} resetLink={resetLink} />
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const lang = await getLang();
  const confirmLink = `${domain}/new-verification?token=${token}`;

  const subject = {
    en: 'Confirm your email',
    fr: 'Confirmer votre email',
    es: 'Confirmar tu email',
    it: 'Conferma il tuo email'
  }[lang];

  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject,
    react: <ConfirmAccountEmail lang={lang} confirmLink={confirmLink} />
  });
};

export const sendMagicLinkEmail = async (email: string, magicLink: string) => {
  const lang = await getLang();

  const subject = {
    en: 'Activate your account',
    fr: 'Activer votre compte',
    es: 'Activar tu cuenta',
    it: 'Attiva il tuo account'
  }[lang];

  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject,
    react: <MagicLinkEmail lang={lang} magicLink={magicLink} />
  });
};

export const sendWelcomeEmail = async (email: string) => {
  console.info('email::sendWelcomeEmail', { email });
  const lang = await getLang();

  const subject = {
    en: 'Welcome to Qards',
    fr: 'Bienvenue chez Qards',
    es: 'Bienvenido a Qards',
    it: 'Benvenuto in Qards'
  }[lang];

  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject,
    react: <WelcomeEmail lang={lang} />
  });
};
