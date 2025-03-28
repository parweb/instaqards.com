'use server';

import { AuthError } from 'next-auth';
import type * as z from 'zod';

import { signIn } from 'auth';
import { getUserByEmail } from 'data/user';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { OnboardSchema } from 'schemas';
import { DEFAULT_LOGIN_REDIRECT } from 'settings';

export const onboard = async (values: z.infer<typeof OnboardSchema>) => {
  const validatedFields = OnboardSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: await translate('actions.login.validation.error') };
  }

  const { email, subdomain } = validatedFields.data;

  const alreadyExistsSubdomain = await db.site.findFirst({
    where: { subdomain }
  });

  if (alreadyExistsSubdomain) {
    return { error: await translate('actions.onboard.subdomain.error') };
  }

  const user = await getUserByEmail(email);

  if (user) {
    return { error: await translate('actions.onboard.email.error') };
  }

  try {
    await signIn('resend', {
      email,
      redirectTo: `${DEFAULT_LOGIN_REDIRECT}/api/site/create?subdomain=${subdomain}`
    });

    return { success: true /*, site*/ };
  } catch (error) {
    console.error({ error });
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: await translate('actions.login.credentials.invalid')
          };
        default:
          return { error: await translate('actions.login.credentials.oops') };
      }
    }

    throw error;
  }
};
