import { UserRole, type User } from '@prisma/client';
import type { Session } from 'next-auth';

import { db } from 'helpers/db';
import { getSession } from 'lib/auth';

type Context = {
  referer: Session['user'];
  db: typeof db;
};

type State = 'NEW' | 'IN_PROGRESS' | 'WIN' | 'LOST';

const list: Record<State | 'default', (context: Context) => Promise<User[]>> = {
  NEW: ctx =>
    ctx.db.user.findMany({
      where: {
        refererId: ctx.referer.id,
        role: UserRole.LEAD,
        subscriptions: { none: { status: 'active' } },
        events: {
          none: { eventType: { in: ['EMAIL_SENT', 'RESERVATION_CREATED'] } }
        }
      }
    }),
  IN_PROGRESS: ctx =>
    ctx.db.user.findMany({
      where: {
        refererId: ctx.referer.id,
        role: UserRole.LEAD,
        subscriptions: { none: { status: 'active' } },
        events: {
          some: { eventType: { in: ['EMAIL_SENT', 'RESERVATION_CREATED'] } }
        }
      }
    }),
  WIN: ctx =>
    ctx.db.user.findMany({
      where: {
        refererId: ctx.referer.id,
        role: UserRole.USER,
        subscriptions: { some: { status: 'active' } }
      }
    }),
  LOST: ctx =>
    ctx.db.user.findMany({
      where: { refererId: ctx.referer.id, role: UserRole.LEAD, company: 'none' }
    }),
  default: ctx =>
    ctx.db.user.findMany({
      where: { refererId: ctx.referer.id, role: UserRole.LEAD }
    })
};

export const all = async (state: State | undefined) => {
  const session = await getSession();

  if (!session || !session?.user) {
    return [];
  }

  if (typeof state === 'undefined')
    return list.default({ referer: session.user, db });
  return list[state]({ referer: session.user, db });
};
