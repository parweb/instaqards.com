'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import * as z from 'zod';
import { User } from '@prisma/client';

import { getUserByEmail } from 'data/user';
import { db } from 'helpers/db';
import { sendVerificationEmail } from 'helpers/mail';
import { generateVerificationToken } from 'helpers/tokens';
import { RegisterSchema } from 'schemas';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  const referer: User['id'] | null = cookies().get('r')?.value ?? null;

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      refererId: referer
    }
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation email sent!' };
};
