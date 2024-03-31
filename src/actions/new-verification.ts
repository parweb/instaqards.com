'use server';

import { signIn } from 'auth';
import { DEFAULT_LOGIN_REDIRECT } from 'auth.config';
import { getUserByEmail } from 'data/user';
import { getVerificationTokenByToken } from 'data/verificiation-token';
import { db } from 'helpers/db';

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: 'Token does not exist!' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'Email does not exist!' };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email
    }
  });

  await signIn('credentials', {
    email: existingToken.email,
    password: existingToken.id,
    redirectTo: DEFAULT_LOGIN_REDIRECT
  });

  return { success: 'Email verified!' };
};
