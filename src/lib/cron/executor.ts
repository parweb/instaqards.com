import { Prisma } from '@prisma/client';

import { lockCron, unlockCron } from 'lib/cron/lock';
import { createHistory, persistError, persistSuccess } from 'lib/cron/persist';
import { CronExecutionOptions, CronExecutionResult } from 'lib/cron/types';
import { validateCronFunction } from 'lib/cron/validate';

export class CronExecutor {
  static async run(
    cron: Prisma.CronGetPayload<{
      select: {
        id: true;
        modulePath: true;
        functionName: true;
      };
    }>,
    options: CronExecutionOptions = {}
  ): Promise<CronExecutionResult> {
    await lockCron(cron.id);

    let history = null;
    const started = new Date();

    try {
      history = await createHistory(cron.id, options);

      const fn = await validateCronFunction(cron.modulePath, cron.functionName);
      const timeoutMs = options.timeoutMs ?? 10 * 60 * 1000;
      const result = await this.runWithTimeout(fn, timeoutMs);
      const duration = new Date().getTime() - started.getTime();
      await persistSuccess(history.id, cron.id, duration, result, options);

      return { success: true, duration, result };
    } catch (error) {
      const duration = new Date().getTime() - started.getTime();

      await persistError(
        history?.id ?? null,
        cron.id,
        duration,
        error,
        options
      );

      return {
        success: false,
        duration,
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      await unlockCron(cron.id);
    }
  }

  static runWithTimeout(fn: () => Promise<unknown>, timeoutMs: number) {
    return Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      )
    ]);
  }
}
