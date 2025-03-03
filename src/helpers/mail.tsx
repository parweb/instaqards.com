import { Resend } from 'resend';
import { cookies } from 'next/headers';

import TwoFactorTokenEmail from '../../emails/two-factor-token';
import ResetPasswordEmail from '../../emails/reset-password';
import ConfirmAccountEmail from '../../emails/confirm-account';
import { DEFAULT_LANG, type Lang } from '../../translations';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = `http://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

const getLang = () => {
  let lang = (cookies().get('lang')?.value ?? DEFAULT_LANG) as Lang;

  switch (true) {
    case lang.toLowerCase().includes('fr'):
      lang = 'fr';
      break;
    case lang.toLowerCase().includes('en'):
      lang = 'en';
      break;
    case lang.toLowerCase().includes('us'):
      lang = 'en';
      break;
    default:
      lang = 'en';
      break;
  }

  return lang;
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject: '2FA Code',
    react: <TwoFactorTokenEmail lang={getLang()} token={token} />
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject: 'Reset your password',
    react: <ResetPasswordEmail lang={getLang()} resetLink={resetLink} />
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject: 'Confirm your email',
    react: <ConfirmAccountEmail lang={getLang()} confirmLink={confirmLink} />
  });
};
