import { db } from 'helpers/db';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      select: { id: true },
      where: { email }
    });

    return user;
  } catch {
    return null;
  }
};
