import { db } from 'helpers/db';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    await db.verificationToken.deleteMany({
      where: { expires: { lt: new Date() } }
    });

    const verificationToken = await db.verificationToken.findUnique({
      where: { token }
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    await db.verificationToken.deleteMany({
      where: { expires: { lt: new Date() } }
    });

    const verificationToken = await db.verificationToken.findFirst({
      where: { email }
    });

    return verificationToken;
  } catch {
    return null;
  }
};
