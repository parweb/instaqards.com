'use server';

import bcrypt from 'bcryptjs';
import * as z from 'zod';

import { getPasswordResetTokenByToken } from 'data/password-reset-token';
import { getUserByEmail } from 'data/user';
import { db } from 'helpers/db';
import { NewPasswordSchema } from 'schemas';
import { translate } from 'helpers/translate';

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: translate('actions.new-password.token.missing') };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: translate('actions.new-password.field.error') };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: translate('actions.new-password.token.error') };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: translate('actions.new-password.token.expire') };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: translate('actions.new-password.email.error') };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: translate('actions.new-password.password.form.success') };
};
