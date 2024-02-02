import { Resend } from 'resend';

import TwoFactorTokenEmail from '../../emails/two-factor-token';
import ResetPasswordEmail from '../../emails/reset-password';
import ConfirmAccountEmail from '../../emails/confirm-account';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = `http://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '2FA Code',
    react: <TwoFactorTokenEmail token={token} />
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    react: <ResetPasswordEmail resetLink={resetLink} />
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm your email',
    react: <ConfirmAccountEmail confirmLink={confirmLink} />
  });
};
