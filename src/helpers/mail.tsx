import { Resend } from 'resend';
import { cookies } from 'next/headers';

import TwoFactorTokenEmail from '../../emails/two-factor-token';
import ResetPasswordEmail from '../../emails/reset-password';
import ConfirmAccountEmail from '../../emails/confirm-account';
import { DEFAULT_LANG, Lang } from '../../translations';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = `http://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject: '2FA Code',
    react: (
      <TwoFactorTokenEmail
        lang={(cookies().get('lang')?.value ?? DEFAULT_LANG) as Lang}
        token={token}
      />
    )
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject: 'Reset your password',
    react: (
      <ResetPasswordEmail
        lang={(cookies().get('lang')?.value ?? DEFAULT_LANG) as Lang}
        resetLink={resetLink}
      />
    )
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: 'contact@qards.link',
    to: email,
    subject: 'Confirm your email',
    react: (
      <ConfirmAccountEmail
        lang={(cookies().get('lang')?.value ?? DEFAULT_LANG) as Lang}
        confirmLink={confirmLink}
      />
    )
  });
};
