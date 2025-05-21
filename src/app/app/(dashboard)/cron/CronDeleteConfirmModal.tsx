'use client';

import { useModal } from 'components/modal/provider';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Button } from 'components/ui/button';
import { deleteCron } from 'lib/actions';

export default function CronDeleteConfirmModal({ cron }: { cron: any }) {
  const [isPending, startTransition] = useTransition();

  const modal = useModal();
  const router = useRouter();

  return (
    <div className="p-6 max-w-md bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow flex flex-col gap-4">
      <h2 className="font-bold text-lg text-red-600">
        Confirmer la suppression
      </h2>

      <p>
        Voulez-vous vraiment supprimer le cron{' '}
        <span className="font-semibold">{cron.name}</span> ?
      </p>

      <div className="flex gap-2 mt-4">
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await deleteCron(cron.id);

              modal?.hide();
              router.refresh();
            })
          }
        >
          Supprimer
        </Button>

        <Button
          variant="outline"
          type="button"
          disabled={isPending}
          onClick={() => window.dispatchEvent(new Event('modal-close'))}
        >
          Annuler
        </Button>
      </div>
    </div>
  );
}
