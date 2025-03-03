import { createAuthClient } from 'better-auth/react';
import { ac, admin, member, owner } from '@/lib/auth/permissions';

import {
  anonymousClient,
  multiSessionClient,
  organizationClient,
  passkeyClient
} from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL as string,
  plugins: [
    passkeyClient(),
    anonymousClient(),
    multiSessionClient(),
    organizationClient({ ac: ac, roles: { owner, admin, member } })
  ]
});
