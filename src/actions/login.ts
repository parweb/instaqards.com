'use server';

import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import type * as z from 'zod';

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
    if (error instanceof AuthError) {
      return { error: await translate('actions.login.credentials.oops') };
    }

    throw error;
  }
};
