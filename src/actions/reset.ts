'use server';

import type * as z from 'zod';

import { getUserByEmail } from 'data/user';
import { sendPasswordResetEmail } from 'helpers/mail';
import { generatePasswordResetToken } from 'helpers/tokens';
import { translate } from 'helpers/translate';
import { ResetSchema } from 'schemas';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: await translate('actions.reset.email.error') };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: await translate('actions.reset.email.not-found') };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: await translate('actions.reset.form.success') };
};
