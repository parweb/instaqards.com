'use client';

import { Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AreaChart, Card } from '@tremor/react';
import { addDays, eachDayOfInterval, format } from 'date-fns';

import ModalButton from 'components/modal-button';
import { Button } from 'components/ui/button';
import { Switch } from 'components/ui/switch';
import { editCron } from 'lib/actions';
import CronDeleteConfirmModal from './CronDeleteConfirmModal';
import CronHistoryModal from './CronHistoryModal';
import CronModalForm from './CronModalForm';
import { range } from 'lodash';

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-500 uppercase">
    {children}
  </th>
);

export default function CronTable({
  crons
}: {
  crons: Prisma.CronGetPayload<{
    include: { history: true };
  }>[];
}) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-zinc-200">
        <thead className="bg-zinc-50">
          <tr>
            <Th>Nom</Th>
            <Th>Expression</Th>
            <Th>Timezone</Th>
            <Th>Module</Th>
            <Th>Fonction</Th>
            <Th>Active</Th>
            <Th>Actions</Th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-200">
          {crons.map(cron => {
            // Harmonisation de l'axe des dates comme dans l'affiliation/analytics
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
              startDate.setDate(endDate.getDate() - 30);
            }
            const days = eachDayOfInterval({ start: startDate, end: endDate });

            const chartData = days.map(date => {
              const dateStr = format(date, 'dd MMM');
              const dayHistory = history.filter(item => {
                const d = new Date(item.startedAt);
                return (
                  d.getFullYear() === date.getFullYear() &&
                  d.getMonth() === date.getMonth() &&
                  d.getDate() === date.getDate()
                );
              });
              return {
                date: dateStr,
                Succès: dayHistory.filter(item => item.status === 'ok').length,
                Échecs: dayHistory.filter(item => item.status === 'error')
                  .length
              };
            });

            return (
              <React.Fragment key={cron.id}>
                <tr className="hover:bg-zinc-50">
                  <td className="px-4 py-2 font-medium text-zinc-900">
                    {cron.name}
                  </td>

                  <td className="px-4 py-2 text-zinc-700">{cron.cronExpr}</td>
                  <td className="px-4 py-2 text-zinc-700">{cron.timezone}</td>
                  <td className="px-4 py-2 text-zinc-700">{cron.modulePath}</td>
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

                  <td className="px-4 py-2 flex gap-2">
                    <ModalButton label="Éditer">
                      <CronModalForm cron={cron} />
                    </ModalButton>

                    <ModalButton label="Supprimer">
                      <CronDeleteConfirmModal cron={cron} />
                    </ModalButton>

                    <ModalButton label="Historique">
                      <CronHistoryModal history={cron.history} />
                    </ModalButton>
                  </td>
                </tr>
                <tr>
                  <td colSpan={7} className="p-0 bg-transparent border-none">
                    <Card className="rounded-none border-0 shadow-none bg-transparent">
                      <AreaChart
                        className="w-full"
                        data={chartData}
                        index="date"
                        categories={['Succès', 'Échecs']}
                        colors={['emerald', 'rose']}
                        showXAxis={true}
                        showGridLines={true}
                        startEndOnly={true}
                        showYAxis={false}
                        showLegend={false}
                        valueFormatter={v => v.toString()}
                        noDataText="Aucune exécution enregistrée."
                      />
                    </Card>
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
