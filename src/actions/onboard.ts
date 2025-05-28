'use server';

import type * as z from 'zod';

import { APIError } from 'better-auth/api';
import { getUserByEmail } from 'data/user';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { auth } from 'lib/auth';
import { OnboardSchema } from 'schemas';
import { uri } from 'settings';

export const onboard = async (values: z.infer<typeof OnboardSchema>) => {
  const validatedFields = OnboardSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: await translate('actions.login.validation.error') };
  }

  const { email, subdomain } = validatedFields.data;

  const alreadyExistsSubdomain = await db.site.count({
    where: { subdomain }
  });

  if (alreadyExistsSubdomain > 0) {
    return { error: await translate('actions.onboard.subdomain.error') };
  }

  const user = await getUserByEmail(email);

  if (user) {
    return { error: await translate('actions.onboard.email.error') };
  }

  try {
    await auth.api.signInMagicLink({
      body: {
        email,
        callbackURL: `${uri.base(`/api/site/create?subdomain=${subdomain}`)}`
      },
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    return { success: true, redirect: uri.app('/email-in') };
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
