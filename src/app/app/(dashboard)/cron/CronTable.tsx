'use client';

import type { Prisma } from '@prisma/client';
import { eachDayOfInterval, format, subDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { GiThrowingBall } from 'react-icons/gi';
import { LuLoader } from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import { Button } from 'components/ui/button';
import { Switch } from 'components/ui/switch';
import { editCron, executeCronManually } from 'lib/actions';
import { cn } from 'lib/utils';
import CronDeleteConfirmModal from './CronDeleteConfirmModal';
import CronHistoryModal from './CronHistoryModal';
import CronModalForm from './CronModalForm';

const Th = ({
  children,
  className
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <th
    className={cn(
      'px-4 py-2 text-left text-xs font-semibold text-zinc-500 uppercase',
      className
    )}
  >
    {children}
  </th>
);

type History = Prisma.HistoryGetPayload<{
  select: {
    id: true;
    startedAt: true;
    status: true;
    durationMs: true;
    message: true;
    endedAt: true;
  };
}>;

const GithubStyleGrid = ({
  history,
  days,
  executionsPerDay = 24
}: {
  history: History[];
  days: Date[];
  executionsPerDay?: number;
}) => {
  console.log({ executionsPerDay, days, history });

  // Pour chaque jour, on génère la liste plate de statuts de ce jour
  const dayGrids = days.map((day, dayIdx) => {
    const statuses: {
      start: Date;
      end: Date;
      history: History[];
      status: History['status'];
    }[] = [];

    for (let i = 0; i < executionsPerDay; i++) {
      const execDate = new Date(day);

      // Calcul dynamique de l'intervalle en minutes
      const intervalMin = 1440 / executionsPerDay;
      const totalMinutes = Math.round(i * intervalMin);

      execDate.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);

      const execDateStart = new Date(execDate);
      // execDateEnd est la date de fin de l'exécution x temps d'exécution par rapport à intervalMin
      const execDateEnd = new Date(execDate);
      execDateEnd.setMinutes(execDateEnd.getMinutes() + intervalMin);

      console.log({ execDateStart, execDateEnd });

      const found = history.filter(item => {
        const date =
          item.startedAt instanceof Date
            ? item.startedAt
            : new Date(item.startedAt);

        return (
          date.getTime() >= execDateStart.getTime() &&
          date.getTime() < execDateEnd.getTime()
        );
      });

      statuses.push({
        start: new Date(execDate),
        end: new Date(execDate),
        history: found,
        status:
          found.length > 0
            ? found.every(item => item.status === 'ok')
              ? 'success'
              : 'error'
            : 'none'
      });
    }

    // Calcul de la grille carrée/rectangulaire pour ce jour
    const totalCells = statuses.length;
    const columns = Math.ceil(Math.sqrt(totalCells));
    const rows = Math.ceil(totalCells / columns);

    // Découpage en lignes pour affichage
    const gridRows = Array.from({ length: rows }, (_, rowIdx) =>
      statuses.slice(rowIdx * columns, (rowIdx + 1) * columns)
    );

    return (
      <div key={dayIdx} className="flex flex-1 flex-col items-center">
        <div className="mb-2 text-xs font-bold text-zinc-700">
          {format(day, 'dd MMM yyyy')}
        </div>

        <div
          className="grid aspect-square max-h-48 w-full gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            display: 'grid'
          }}
        >
          {gridRows.map((row, rowIdx) =>
            row.map(({ status, history }, colIdx) => (
              <ModalButton
                key={`${rowIdx}-${colIdx}`}
                className={cn(
                  "pointer-events-auto block h-auto items-start justify-start gap-0 rounded-none bg-transparent px-0 py-0 text-base font-normal whitespace-normal text-current opacity-100 shadow-none outline transition-none hover:bg-transparent focus-visible:border-transparent focus-visible:ring-0 has-[>svg]:px-0 aria-invalid:border-transparent aria-invalid:ring-transparent dark:aria-invalid:ring-transparent [&_svg]:pointer-events-auto [&_svg]:shrink [&_svg:not([class*='size-'])]:size-auto",
                  'h-full w-full cursor-pointer rounded-sm bg-gray-100 hover:bg-[#dedede]',
                  { 'bg-[#00bc7d] hover:bg-[#009c60]': status === 'success' },
                  { 'bg-[#ff1f57] hover:bg-[#d6003d]': status === 'error' }
                )}
                label={<div />}
                asChild
              >
                <CronHistoryModal history={history} />
              </ModalButton>
            ))
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-row items-center justify-center gap-2 p-2">
        {dayGrids}
      </div>
    </div>
  );
};

// Déduit la granularité d'une expression cron (minute, heure, jour) avec cron-parser (optimisé via fields)

export default function CronTable({
  crons
}: {
  crons: Prisma.CronGetPayload<{
    select: {
      id: true;
      name: true;
      cronExpr: true;
      modulePath: true;
      functionName: true;
      enabled: true;
      history: {
        select: {
          id: true;
          startedAt: true;
          status: true;
          durationMs: true;
          message: true;
          endedAt: true;
        };
      };
    };
  }>[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-zinc-200">
        <thead className="bg-zinc-50">
          <tr>
            <Th>Nom</Th>
            <Th>Expression</Th>
            <Th>Module</Th>
            <Th>Fonction</Th>
            <Th>Active</Th>
            <Th className="w-auto"></Th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-200">
          {crons.map(cron => {
            const history = cron.history;

            let startDate: Date, endDate: Date;

            if (history.length > 0) {
              startDate = new Date(history[0].startedAt);
              endDate = new Date(history[history.length - 1].startedAt);
              if (startDate > endDate)
                [startDate, endDate] = [endDate, startDate];
            } else {
              endDate = new Date();
              startDate = new Date();
              startDate.setDate(subDays(endDate, 6).getDate());
            }

            const days = eachDayOfInterval({ start: startDate, end: endDate });

            return (
              <React.Fragment key={cron.id}>
                <tr
                  className={cn('', {
                    'border border-red-200 bg-red-100': !cron.enabled
                  })}
                >
                  <td className="w-full px-4 py-2 font-medium text-zinc-900">
                    {cron.name}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-zinc-700">
                    {cron.cronExpr}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-zinc-700">
                    {cron.modulePath}
                  </td>

                  <td className="px-4 py-2 text-zinc-700">
                    {cron.functionName}
                  </td>

                  <td className="px-4 py-2 text-zinc-700">
                    <form
                      action={async () => {
                        await editCron(cron.id, {
                          enabled: !cron.enabled
                        });

                        router.refresh();
                      }}
                    >
                      <Button variant="ghost" size="icon" type="submit">
                        <input type="hidden" name="id" value={cron.id} />
                        <Switch checked={cron.enabled} name="enabled" />
                      </Button>
                    </form>
                  </td>

                  <td className="flex w-auto justify-end gap-2 px-4 py-2">
                    <ModalButton label="Éditer">
                      <CronModalForm cron={cron} />
                    </ModalButton>

                    <ModalButton label="Supprimer">
                      <CronDeleteConfirmModal cron={cron} />
                    </ModalButton>

                    <Button
                      onClick={() =>
                        startTransition(async () => {
                          try {
                            await executeCronManually(cron.id);
                            router.refresh();
                          } catch (error) {
                            console.error(
                              "Erreur lors de l'exécution manuelle:",
                              error
                            );

                            // Amélioration: Affichage d'erreur utilisateur
                            const errorMessage =
                              error instanceof Error
                                ? error.message
                                : 'Erreur inconnue';
                            if (errorMessage.includes('rate limit')) {
                              alert(
                                "⚠️ Trop d'exécutions rapprochées. Veuillez attendre 30 secondes."
                              );
                            } else if (
                              errorMessage.includes('already running')
                            ) {
                              alert(
                                "⚠️ Ce cron est déjà en cours d'exécution."
                              );
                            } else if (errorMessage.includes('timeout')) {
                              alert(
                                "⚠️ Timeout: l'exécution a pris trop de temps."
                              );
                            } else {
                              alert(`❌ Erreur: ${errorMessage}`);
                            }
                          }
                        })
                      }
                      disabled={isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                      title="Exécuter manuellement"
                    >
                      {isPending ? (
                        <LuLoader className="animate-spin" />
                      ) : (
                        <GiThrowingBall />
                      )}
                    </Button>

                    {/* <ModalButton label="Historique">
                      <CronHistoryModal history={cron.history} />
                    </ModalButton> */}
                  </td>
                </tr>

                <tr
                  className={cn('', {
                    'border border-red-200 bg-red-100': !cron.enabled
                  })}
                >
                  <td colSpan={6} className="border-none bg-transparent p-0">
                    <GithubStyleGrid
                      history={cron.history}
                      days={days}
                      executionsPerDay={Math.pow(6, 2)}
                      // executionsPerDay={36}
                      // executionsPerDay={72}
                      // executionsPerDay={getGranularity(cron.cronExpr)}
                    />
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
