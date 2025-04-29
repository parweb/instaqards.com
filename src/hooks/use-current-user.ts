import { useSession } from 'lib/auth/client';

export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};
