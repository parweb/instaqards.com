import { db } from 'helpers/db';
import { CronExecutionOptions } from 'lib/cron/types';
import { CronExpressionParser } from 'cron-parser';
import { DateTime } from 'luxon';
import { Cron } from '@prisma/client';

export async function createHistory(
  cronId: string,
  options: CronExecutionOptions
) {
  return db.history.create({
    data: {
      cronId,
      status: 'running',
      startedAt: new Date(),
      endedAt: new Date(),
      durationMs: 0,
      message: options.manual ? { manual: true } : {}
    }
  });
}

export async function persistSuccess(
  historyId: string,
  cronId: string,
  duration: number,
  result: any,
  options: CronExecutionOptions
) {
  const ended = new Date();
  await db.$transaction([
    db.history.update({
      where: { id: historyId },
      data: {
        status: 'ok',
        endedAt: ended,
        durationMs: duration,
        message: options.manual ? { manual: true, result } : { result }
      }
    }),
    db.cron.update({
      where: { id: cronId },
      data: {
        lastRunAt: ended,
        lastStatus: 'ok',
        lastDurationMs: duration
      }
    })
  ]);
}

export async function persistError(
  historyId: string | null,
  cronId: string,
  duration: number,
  error: unknown,
  options: CronExecutionOptions
) {
  const ended = new Date();
  await db.$transaction(async tx => {
    if (historyId) {
      await tx.history.update({
        where: { id: historyId },
        data: {
          status: 'error',
          endedAt: ended,
          durationMs: duration,
          message: options.manual
            ? {
                manual: true,
                error:
                  error instanceof Error ? error.message : 'Erreur inconnue'
              }
            : {
                error:
                  error instanceof Error ? error.message : 'Erreur inconnue'
              }
        }
      });
    }

    await tx.cron.update({
      where: { id: cronId },
      data: {
        lastRunAt: ended,
        lastStatus: error instanceof Error ? error.message : 'Erreur inconnue',
        lastDurationMs: duration
      }
    });
  });
}

function isDue(job: Cron, now: DateTime): boolean {
  let prev;

  try {
    prev = DateTime.fromJSDate(
      CronExpressionParser.parse(job.cronExpr, {
        currentDate: now.toJSDate(), // On part toujours de maintenant
        tz: job.timezone
      })
        .prev()
        .toDate()
    );
  } catch {
    return true; // Si l'expression cron est invalide, on l'exécute quand même
  }

  if (job.lastRunAt) {
    const lastRun = DateTime.fromJSDate(job.lastRunAt);
    return prev > lastRun && now.diff(prev, 'seconds').seconds < 60;
  }

  return now.diff(prev, 'seconds').seconds < 60;
}

export async function getDueCrons() {
  const now = DateTime.utc();

  // 1. Récupère les candidats (enabled et non-lockés ou lockés depuis > 5 min)
  const candidates = await db.cron.findMany({
    where: {
      enabled: true,
      OR: [
        { lockedAt: null },
        { lockedAt: { lt: new Date(now.toJSDate().getTime() - 5 * 60 * 1000) } }
      ]
    }
  });

  // 2. Filtre ceux qui sont vraiment dus selon leur expression cron
  const dueJobs = candidates.filter(job => isDue(job, now)).slice(0, 5);

  console.log('candidates:', candidates.length, 'dueJobs:', dueJobs.length);

  return dueJobs;
}
