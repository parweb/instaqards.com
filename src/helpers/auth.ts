import { getSession } from 'lib/auth';

export const currentUser = async () => {
  const session = await getSession();
  return session?.user;
};

export const currentRole = async () => {
  const user = await currentUser();
  return user?.role;
};
