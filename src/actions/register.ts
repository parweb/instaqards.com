'use server';

import { type User, UserRole } from '@prisma/client';
import { cookies } from 'next/headers';
import * as z from 'zod';

import { translate } from 'helpers/translate';
import { auth } from 'lib/auth';
import { RegisterSchema } from 'schemas';
import { db } from 'helpers/db';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const { email, password, name, refererId } = await RegisterSchema.merge(
      z.object({
        refererId: z
          .string()
          .optional()
          .nullable()
          .transform(async () => (await cookies()).get('r')?.value ?? undefined)
      })
    ).parseAsync(values);

    const response = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: UserRole.USER
      }
    });

    console.log({ response });

    console.info({ success: await translate('actions.register.form.success') });
    return { success: await translate('actions.register.form.success') };
  } catch (error) {
    console.error({ error });
    return { error: await translate('actions.register.field.error') };
  }
};
