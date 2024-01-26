import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import { getServerSession, type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import InstagramProvider from 'next-auth/providers/instagram';

import prisma from 'lib/prisma';
import { auth } from 'auth';

export function getSession() {
  return auth();
}

export function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null
  ) => {
    const session = await getSession();

    if (!session) {
      return {
        error: 'Not authenticated'
      };
    }

    const site = await prisma.site.findUnique({
      where: {
        id: siteId
      }
    });

    if (!site || site.userId !== session.user.id) {
      return {
        error: 'Not authorized'
      };
    }

    return action(formData, site, key);
  };
}

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: 'Not authenticated'
      };
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      include: {
        site: true
      }
    });
    if (!post || post.userId !== session.user.id) {
      return {
        error: 'Post not found'
      };
    }

    return action(formData, post, key);
  };
}
