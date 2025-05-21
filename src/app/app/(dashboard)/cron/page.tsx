import { Suspense } from 'react';

import ModalButton from 'components/modal-button';
import { db } from 'helpers/db';
import { getSession } from 'lib/auth';
import CronModalForm from './CronModalForm';
import CronTable from './CronTable';

export default async function CronDashboard() {
  const session = await getSession();
  if (!session?.user) return null;

  const crons = await db.cron.findMany({ orderBy: { id: 'desc' } });

  return (
    <div className="flex flex-col p-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Cron Jobs
          </h1>

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
