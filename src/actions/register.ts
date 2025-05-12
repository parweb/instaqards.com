'use server';

import { UserRole } from '@prisma/client';
import * as z from 'zod';

import { APIError } from 'better-auth/api';
import { translate } from 'helpers/translate';
import { auth } from 'lib/auth';
import { RegisterSchema } from 'schemas';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const { email, password, name } = await RegisterSchema.parseAsync(values);

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: UserRole.USER,
        affiliateRate: 0.05
      }
    });

    return { success: await translate('actions.register.form.success') };
  } catch (error) {
    console.error({ error });

    if (error instanceof APIError) {
      return {
        error: await translate('actions.register.field.error'),
        code: error.body?.code,
        message: error.body?.message
      };
    }

    throw error;
  }
};
