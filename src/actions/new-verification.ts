'use server';

import { getUserByEmail } from 'data/user';
import { getVerificationTokenByToken } from 'data/verificiation-token';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: await translate('actions.new-verification.token.error') };
  }

  const hasExpired = existingToken.expiresAt < new Date();

  if (hasExpired) {
    return { error: await translate('actions.new-verification.token.expire') };
  }

  if (existingToken.identifier === null) {
    return { error: await translate('actions.new-verification.email.error') };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: await translate('actions.new-verification.email.error') };
  }

  await db.user.update({
    select: { id: true },
    where: { id: existingUser.id },
    data: {
      emailVerified: true,
      email: existingToken.identifier
    }
  });

  return {
    success: await translate('actions.new-verification.email.form.success')
  };
};
