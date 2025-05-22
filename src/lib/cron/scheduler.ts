import { CronExecutor } from 'lib/cron/executor';
import { getDueCrons } from 'lib/cron/persist';

export async function runScheduler() {
  const dueCrons = await getDueCrons();

  console.log(
    `🕒 Scheduler: Found ${dueCrons.length} cron(s) due for execution`
  );

  const results = [];

  // Exécution séquentielle pour éviter les conflits
  for (const cron of dueCrons) {
    try {
      console.log(`🚀 Executing cron: ${cron.name} (${cron.cronExpr})`);
      const result = await CronExecutor.run(cron);
      results.push({ cron, result });
      console.log(
        `✅ Cron ${cron.name} completed:`,
        result.success ? 'SUCCESS' : 'FAILED'
      );
    } catch (error) {
      console.error(`❌ Cron ${cron.name} failed:`, error);
      results.push({
        cron,
        result: {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }

  return results;
}
