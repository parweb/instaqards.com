'use server';

import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

import { update } from 'auth';
import { getUserByEmail, getUserById } from 'data/user';
import { currentUser } from 'helpers/auth';
import { db } from 'helpers/db';
import { sendVerificationEmail } from 'helpers/mail';
import { generateVerificationToken } from 'helpers/tokens';
import { SettingsSchema } from 'schemas';
import { translate } from 'helpers/translate';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user?.id) {
    return { error: translate('actions.settings.unauthorized') };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: translate('actions.settings.unauthorized') };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: translate('actions.settings.email.error') };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: translate('actions.settings.email.success') };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: translate('actions.settings.password.error') };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values
    }
  });

  update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role as UserRole
    }
  });

  return { success: translate('actions.settings.form.success') };
};
