'use server';

import type * as z from 'zod';

import { translate } from 'helpers/translate';
import { auth } from 'lib/auth';
import { LoginSchema } from 'schemas';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: translate('actions.login.validation.error') };
  }

  const { email, password } = validatedFields.data;

  console.log('login', { email, password });

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password
      }
    });
  } catch (error) {
    console.log('error', { error });

    throw error;
  }
};
