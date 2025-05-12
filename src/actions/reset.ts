'use server';

import type * as z from 'zod';

import { translate } from 'helpers/translate';
import { auth } from 'lib/auth';
import { ResetSchema } from 'schemas';
import { uri } from 'settings';
import { APIError } from 'better-auth/api';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: await translate('actions.reset.email.error') };
  }

  const { email } = validatedFields.data;

  try {
    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: uri.app('/new-password')
      }
    });

    return { success: await translate('actions.reset.form.success') };
  } catch (error) {
    console.error({ error });

    if (error instanceof APIError) {
      return {
        error: await translate('actions.reset.email.error'),
        code: error.body?.code,
        message: error.body?.message
      };
    }

    throw error;
  }
};
