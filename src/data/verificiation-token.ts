import { db } from 'helpers/db';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    await db.verification.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    });

    const verification = await db.verification.findFirst({
      where: { identifier: token }
    });

    return verification;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    await db.verification.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    });

    const verification = await db.verification.findFirst({
      where: { value: JSON.stringify({ email }) }
    });

    return verification;
  } catch {
    return null;
  }
};
