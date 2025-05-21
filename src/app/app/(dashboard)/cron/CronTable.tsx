'use client';

import ModalButton from 'components/modal-button';
import CronDeleteConfirmModal from './CronDeleteConfirmModal';
import CronModalForm from './CronModalForm';

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-500 uppercase">
    {children}
  </th>
);

export default function CronTable({ crons }: { crons: any[] }) {
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
            <Th>Actions</Th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-200">
          {crons.map(cron => (
            <tr key={cron.id} className="hover:bg-zinc-50">
              <td className="px-4 py-2 font-medium text-zinc-900">
                {cron.name}
              </td>
              <td className="px-4 py-2 text-zinc-700">{cron.cronExpr}</td>
              <td className="px-4 py-2 text-zinc-700">{cron.timezone}</td>
              <td className="px-4 py-2 text-zinc-700">{cron.modulePath}</td>
              <td className="px-4 py-2 text-zinc-700">{cron.functionName}</td>

              <td className="px-4 py-2 flex gap-2">
                <ModalButton label="Éditer">
                  <CronModalForm cron={cron} />
                </ModalButton>

                <ModalButton label="Supprimer">
                  <CronDeleteConfirmModal cron={cron} />
                </ModalButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
