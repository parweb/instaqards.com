import { db } from 'helpers';
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

    if (!session || !session?.user) {
      return {
        error: 'Not authenticated'
      };
    }

    const site = await db.site.findUnique({
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

    if (!session?.user?.id) {
      return {
        error: 'Not authenticated'
      };
    }

    const post = await db.post.findUnique({
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
