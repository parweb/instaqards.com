import { db } from 'helpers/db';

export async function lockCron(id: string): Promise<void> {
  const now = new Date();

  const updated = await db.cron.updateMany({
    where: {
      id,
      OR: [
        { lockedAt: null },
        { lockedAt: { lt: new Date(now.getTime() - 5 * 60 * 1000) } }
      ]
    },
    data: { lockedAt: now }
  });

  if (updated.count === 0) {
    throw new Error(`Cron ${id} is already running or recently executed`);
  }
}

export async function unlockCron(id: string): Promise<void> {
  await db.cron.update({
    where: { id },
    data: { lockedAt: null }
  });
}
