import { db } from 'helpers/db';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    await db.verification.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    });

    const verification = await db.verification.findFirst({
      select: { expiresAt: true, identifier: true },
      where: { identifier: token }
    });

    return verification;
  } catch {
    return null;
  }
};
