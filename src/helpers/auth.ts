import { getSession } from 'lib/auth';

export const currentUser = async () => {
  const session = await getSession();
  return session?.user;
};
