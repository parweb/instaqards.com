import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

import { auth } from 'lib/auth';

export const { signIn, signOut, useSession } = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient()]
});
