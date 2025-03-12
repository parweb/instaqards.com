'use server';

import { AuthError } from 'next-auth';
import type * as z from 'zod';

import { signIn } from 'auth';
import { getTwoFactorConfirmationByUserId } from 'data/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from 'data/two-factor-token';
import { getUserByEmail } from 'data/user';
import { db } from 'helpers/db';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from 'helpers/mail';
import {
  generateTwoFactorToken,
  generateVerificationToken
} from 'helpers/tokens';
import { LoginSchema } from 'schemas';
import { DEFAULT_LOGIN_REDIRECT } from 'auth.config';
import { translate } from 'helpers/translate';

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: translate('actions.login.validation.error') };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: translate('actions.login.validation.email.error') };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: translate('actions.login.validation.form.success') };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: translate('actions.login.token.error') };
      }

      if (twoFactorToken.token !== code) {
        return { error: translate('actions.login.token.error') };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: translate('actions.login.token.expire') };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        });
      }

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id }
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
    });
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
