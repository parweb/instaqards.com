'use server';

import type * as z from 'zod';

import { APIError } from 'better-auth/api';
import { translate } from 'helpers/translate';
import { auth } from 'lib/auth';
import { LoginSchema } from 'schemas';

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: await translate('actions.login.validation.error') };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await auth.api.signInEmail({ body: { email, password } });
    return { success: { callbackUrl: callbackUrl || '/', user } };
  } catch (error) {
    console.error({ error });

    if (error instanceof APIError) {
      return {
        error: await translate('actions.login.credentials.oops'),
        code: error.body?.code,
        message: error.body?.message
      };
    }

    throw error;
  }
};
