import 'server-only';

import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Resend from 'next-auth/providers/resend';
// import Github from 'next-auth/providers/github';
// import Google from 'next-auth/providers/google';
// import Tiktok from '@auth/core/providers/tiktok';

import { getUserByEmail } from 'data/user';
import { getVerificationTokenByEmail } from 'data/verificiation-token';
import { sendMagicLinkEmail } from 'helpers/mail';
import { LoginSchema } from 'schemas';
import { sender } from 'settings';

export default {
  pages: {
    verifyRequest: '/email-in',
    signIn: '/login'
  },
  experimental: { enableWebAuthn: true },
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
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          const existingToken = await getVerificationTokenByEmail(email);

          if (passwordsMatch || existingToken?.id === password) return user;
        }

        return null;
      }
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: sender,
      async sendVerificationRequest({ identifier, url }) {
        try {
          await sendMagicLinkEmail(identifier, url);
        } catch (error) {
          console.error('Resend::sendVerificationRequest', { error });
          throw error;
        }
      }
    })
  ]
} satisfies NextAuthConfig;
