'use server';

import type * as z from 'zod';

import { db } from 'helpers/db';
import { OnboardSchema } from 'schemas';
import { translate } from 'helpers/translate';
import { getUserByEmail } from 'data/user';
import { generateVerificationToken } from 'helpers/tokens';
import { signIn } from 'auth';
import { AuthError } from 'next-auth';

export const onboard = async (values: z.infer<typeof OnboardSchema>) => {
  const validatedFields = OnboardSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: translate('actions.login.validation.error') };
  }

  const { email, subdomain } = validatedFields.data;

  const alreadyExistsSubdomain = await db.site.findFirst({
    where: { subdomain }
  });

  if (alreadyExistsSubdomain) {
    return { error: translate('actions.onboard.subdomain.error') };
  }

  const user = await getUserByEmail(email);

  if (user) {
    return { error: translate('actions.onboard.email.error') };
  }

  try {
    await signIn('resend', {
      email
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: translate('actions.login.credentials.invalid') };
        default:
          return { error: translate('actions.login.credentials.oops') };
      }
    }

    throw error;
  }
};
