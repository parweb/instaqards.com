import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
// import Github from 'next-auth/providers/github';
// import Google from 'next-auth/providers/google';
// import Tiktok from '@auth/core/providers/tiktok';

import { getUserByEmail } from 'data/user';
import { LoginSchema } from 'schemas';

export const apiAuthPrefix = '/api/auth';

export const publicRoutes = ['/new-verification'];

export const authRoutes = [
  '/login',
  '/register',
  '/error',
  '/reset',
  '/new-password'
];

export const DEFAULT_LOGIN_REDIRECT = '/';

export default {
  providers: [
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET
    // }),
    // Github({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET
    // }),
    // Tiktok({
    //   clientId: process.env.TIKTOK_CLIENT_KEY,
    //   clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    //   issuer: ''
    //   // ,token:''
    // }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || (!user.password ?? '')) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user?.password!
          );

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ]
} satisfies NextAuthConfig;
