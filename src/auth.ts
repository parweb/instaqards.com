import { PrismaAdapter } from '@auth/prisma-adapter';
import type { UserRole } from '@prisma/client';
import NextAuth from 'next-auth';

import authConfig from 'auth.config';
import { getAccountByUserId } from 'data/account';
import { getTwoFactorConfirmationByUserId } from 'data/two-factor-confirmation';
import { getUserById } from 'data/user';
import { db } from 'helpers/db';
import { nanoid } from 'nanoid';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update: update
} = NextAuth({
  events: {
    linkAccount: async data => {
      console.log('events::linkAccount', data);
      // @ts-ignore
      await db.account.create({ data });
    },
    createUser: async message => {
      console.log('events::createUser', message);

      /*
      
      events::createUser {
        user: {
          id: 'cm8yas7jz0001spnkvjlpthtd',
          name: null,
          email: 'parweb+salam@gmail.com',
          emailVerified: 2025-04-01T09:30:31.102Z,
          image: null,
          password: null,
          isTwoFactorEnabled: false,
          billing_address: {},
          payment_method: {},
          createdAt: 2025-04-01T09:30:31.103Z,
          updatedAt: 2025-04-01T09:30:31.103Z,
          role: 'USER',
          refererId: null
        }
      }

      */

      if (message.user.id) {
        db.event
          .create({
            data: {
              userId: message.user.id,
              eventType: 'USER_SIGNUP',
              payload: JSON.parse(JSON.stringify(message)),
              correlationId: nanoid()
            }
          })
          .then(event => {
            console.log('events::createUser', event);
          })
          .catch(error => {
            console.error('events::createUser', error);
          });
      }
    },
    updateUser: async message => {
      console.log('events::updateUser', message);
    },
    signIn: async message => {
      console.log('events::signIn', message);
    },
    signOut: async message => {
      console.log('events::signOut', message);
    },
    session: async message => {
      // console.log('events::session', message);
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log('callbacks::signIn', { user, account });

      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id as string);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session?.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        // @ts-ignore
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    }
  },

  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig
});
