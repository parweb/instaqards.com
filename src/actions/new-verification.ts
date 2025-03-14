'use server';

import { signIn } from 'auth';
import { DEFAULT_LOGIN_REDIRECT } from 'settings';
import { getUserByEmail } from 'data/user';
import { getVerificationTokenByToken } from 'data/verificiation-token';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: translate('actions.new-verification.token.error') };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: translate('actions.new-verification.token.expire') };
  }

  if (existingToken.identifier === null) {
    return { error: translate('actions.new-verification.email.error') };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: translate('actions.new-verification.email.error') };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.identifier
    }
  });

  await signIn('credentials', {
    email: existingToken.identifier,
    password: existingToken.id,
    redirectTo: DEFAULT_LOGIN_REDIRECT
  });

  return { success: translate('actions.new-verification.email.form.success') };
};
