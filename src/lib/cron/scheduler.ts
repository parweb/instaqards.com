import { Cron } from '@prisma/client';
import { CronExpressionParser } from 'cron-parser';
import { DateTime } from 'luxon';

import { db } from 'helpers/db';

export async function runScheduler() {
  const now = DateTime.utc();

  // 1. Sélectionne et locke les jobs éligibles (SKIP LOCKED simulé)
  const jobs = await db.$transaction(async tx => {
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

    console.log('candidates', candidates);

    // On ne locke que ceux qui sont dus
    const dueJobs = candidates.filter(j => isDue(j, now)).slice(0, 5);

    console.log('dueJobs', dueJobs);

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

  console.log('jobs', jobs);

  // 2. Exécute les jobs
  for (const job of jobs) {
    const started = new Date();
    let executionId: string | null = null;

    try {
      // Crée une entrée d'exécution (status: running)
      const exec = await db.history.create({
        data: {
          cronId: job.id,
          status: 'running',
          startedAt: started,
          endedAt: started,
          durationMs: 0,
          message: {}
        }
      });

      executionId = exec.id;

      const mod = await import(`crons/${job.modulePath}`);
      const result = await mod[job.functionName]();

      const ended = new Date();

      await db.history.update({
        where: { id: executionId },
        data: {
          status: 'ok',
          endedAt: ended,
          durationMs: ended.getTime() - started.getTime(),
          message: JSON.stringify(result)
        }
      });

      await markSuccess(job.id, ended.getTime() - started.getTime());
    } catch (error: unknown) {
      console.error(error);

      const ended = new Date();

      if (executionId) {
        await db.history.update({
          where: { id: executionId },
          data: {
            status: 'error',
            endedAt: ended,
            durationMs: ended.getTime() - started.getTime(),
            message: {
              error:
                error instanceof Error
                  ? error.message.slice(0, 255)
                  : 'Erreur inconnue'
            }
          }
        });
      }

      await markFailure(
        job.id,
        error as Error,
        ended.getTime() - started.getTime()
      );
    } finally {
      await unlockJob(job.id);
    }
  }

  return jobs;
}

function isDue(job: Cron, now: DateTime) {
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
    return true;
  }

  if (job.lastRunAt) {
    const lastRun = DateTime.fromJSDate(job.lastRunAt);
    return prev > lastRun && now.diff(prev, 'seconds').seconds < 60;
  }

  return now.diff(prev, 'seconds').seconds < 60;
}

async function markSuccess(id: string, dur: number) {
  await db.cron.update({
    where: { id },
    data: {
      lastRunAt: new Date(),
      lastStatus: 'ok',
      lastDurationMs: dur
    }
  });
}
async function markFailure(id: string, err: Error, dur: number) {
  await db.cron.update({
    where: { id },
    data: {
      lastRunAt: new Date(),
      lastStatus: err.message.slice(0, 255),
      lastDurationMs: dur
    }
  });
}
async function unlockJob(id: string) {
  await db.cron.update({
    where: { id },
    data: { lockedAt: null }
  });
}
