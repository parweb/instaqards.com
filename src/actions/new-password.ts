'use server';

import bcrypt from 'bcryptjs';
import type * as z from 'zod';

import { getPasswordResetTokenByToken } from 'data/password-reset-token';
import { getUserByEmail } from 'data/user';
import { db } from 'helpers/db';
import { NewPasswordSchema } from 'schemas';
import { translate } from 'helpers/translate';
import { auth } from 'lib/auth';
import { APIError } from 'better-auth/api';

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: await translate('actions.new-password.token.missing') };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: await translate('actions.new-password.field.error') };
  }

  const { password } = validatedFields.data;

  try {
    await auth.api.resetPassword({
      body: {
        token,
        newPassword: password
      }
    });

    return {
      success: await translate('actions.new-password.password.form.success')
    };
  } catch (error) {
    console.error({ error });

    if (error instanceof APIError) {
      return {
        error: await translate('actions.new-password.field.error'),
        code: error.body?.code,
        message: error.body?.message
      };
    }

    throw error;
  }
};
