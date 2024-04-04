'use server';

import * as z from 'zod';

import { getUserByEmail } from 'data/user';
import { sendPasswordResetEmail } from 'helpers/mail';
import { generatePasswordResetToken } from 'helpers/tokens';
import { ResetSchema } from 'schemas';
import { translate } from 'helpers/translate';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: translate('actions.reset.email.error') };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: translate('actions.reset.email.not-found') };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: translate('actions.reset.form.success') };
};
