import { DateTime } from 'luxon';
import { PrismaClient, Cron } from '@prisma/client';
// @ts-ignore
const parseExpression = require('cron-parser').parseExpression;

const prisma = new PrismaClient();

export async function runScheduler() {
  const now = DateTime.utc();

  // 1. Sélectionne et locke les jobs éligibles (SKIP LOCKED simulé)
  const jobs = await prisma.$transaction(async tx => {
    // Jobs non lockés ou lockés depuis > 5 min (crash recovery)
    const candidates = await tx.cron.findMany({
      where: {
        enabled: true,
        OR: [
          { lockedAt: null },
          { lockedAt: { lt: new Date(Date.now() - 5 * 60 * 1000) } }
        ]
      }
    });

    // On ne locke que ceux qui sont dus
    const dueJobs = candidates.filter(j => isDue(j, now)).slice(0, 5);

    // On locke les jobs sélectionnés
    await Promise.all(
      dueJobs.map(job =>
        tx.cron.update({
          where: { id: job.id },
          data: { lockedAt: new Date() }
        })
      )
    );

    return dueJobs;
  });

  // 2. Exécute les jobs
  for (const job of jobs) {
    const started = Date.now();
    try {
      const mod = await import(job.modulePath);
      await mod[job.functionName]();
      await markSuccess(job.id, Date.now() - started);
    } catch (e: any) {
      await markFailure(job.id, e, Date.now() - started);
    } finally {
      await unlockJob(job.id);
    }
  }
}

function isDue(job: Cron, now: DateTime) {
  const options = {
    currentDate: job.lastRunAt ?? new Date(0),
    tz: job.timezone
  };
  const it = parseExpression(job.cronExpr, options);
  const next = DateTime.fromJSDate(it.next().toDate());
  return next <= now && now.diff(next, 'seconds').seconds < 60;
}

async function markSuccess(id: number, dur: number) {
  await prisma.cron.update({
    where: { id },
    data: {
      lastRunAt: new Date(),
      lastStatus: 'ok',
      lastDurationMs: dur
    }
  });
}
async function markFailure(id: number, err: Error, dur: number) {
  await prisma.cron.update({
    where: { id },
    data: {
      lastRunAt: new Date(),
      lastStatus: err.message.slice(0, 255),
      lastDurationMs: dur
    }
  });
}
async function unlockJob(id: number) {
  await prisma.cron.update({
    where: { id },
    data: { lockedAt: null }
  });
}
