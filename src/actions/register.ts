'use server';

import { type User, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import type * as z from 'zod';

import { getUserByEmail } from 'data/user';
import { db } from 'helpers/db';
import { sendVerificationEmail } from 'helpers/mail';
import { generateVerificationToken } from 'helpers/tokens';
import { translate } from 'helpers/translate';
import { RegisterSchema } from 'schemas';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  console.info({ values });

  const validatedFields = RegisterSchema.safeParse(values);
  console.info({ validatedFields });

  const referer: User['id'] | null = (await cookies()).get('r')?.value ?? null;
  console.info({ referer });

  if (!validatedFields.success) {
    return { error: await translate('actions.register.field.error') };
  }

  const { email, password, name } = validatedFields.data;
  console.info({ email, password, name });

  const hashedPassword = await bcrypt.hash(password, 10);
  console.info({ hashedPassword });

  const existingUser = await getUserByEmail(email);
  console.info({ existingUser });

  if (existingUser) {
    if (existingUser.role !== UserRole.LEAD) {
      return { error: await translate('actions.register.email.error') };
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        name,
        role: UserRole.USER,
        password: hashedPassword,
        ...(existingUser.refererId === null && { refererId: referer })
      }
    });
  } else {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        refererId: referer
      }
    });
  }

  const verificationToken = await generateVerificationToken(email);
  console.info({ verificationToken });

  await sendVerificationEmail(email, verificationToken.token).catch(
    console.error
  );

  console.info({ success: await translate('actions.register.form.success') });
  return { success: await translate('actions.register.form.success') };
};
