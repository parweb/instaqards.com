import { subDays } from 'date-fns';
import { Suspense } from 'react';
import { LuLoader } from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import { db } from 'helpers/db';
import { getSession } from 'lib/auth';
import { CronJobStatus } from './CronJobStatus';
import CronModalForm from './CronModalForm';
import CronTable from './CronTable';

export default async function CronDashboard() {
  const session = await getSession();
  if (!session?.user) return null;

  const crons = await db.cron.findMany({
    include: {
      history: {
        orderBy: { startedAt: 'desc' },
        where: {
          AND: [
            {
              startedAt: {
                gte: new Date(subDays(new Date(), 6).setHours(0, 0, 0, 0))
              }
            },
            {
              startedAt: { lte: new Date(new Date().setHours(23, 59, 59, 999)) }
            }
          ]
        }
      }
    }
  });

  return (
    <div className="flex flex-col p-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Cron Jobs
          </h1>

          <Suspense fallback={<LuLoader className="animate-spin" />}>
            <CronJobStatus />
          </Suspense>

          <ModalButton label="Ajouter un cron">
            <CronModalForm />
          </ModalButton>
        </div>

        <Suspense fallback={null}>
          <CronTable crons={crons} />
        </Suspense>
      </div>
    </div>
  );
}
