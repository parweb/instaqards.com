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
    <div className="flex max-w-md flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow dark:border-zinc-700 dark:bg-zinc-800">
      <h2 className="text-lg font-bold text-red-600">
        Confirmer la suppression
      </h2>

      <p>
        Voulez-vous vraiment supprimer le cron{' '}
        <span className="font-semibold">{cron.name}</span> ?
      </p>

      <div className="mt-4 flex gap-2">
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
