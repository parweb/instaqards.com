'use client';

import { History } from '@prisma/client';
import { useEffect, useState } from 'react';

import {
  CalendarIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  HashIcon,
  InfoIcon,
  XCircleIcon
} from 'lucide-react';

import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';
import useOnScreen from 'hooks/use-on-screen';

const statusMap = {
  ok: {
    label: 'Succès',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: <CheckCircle2Icon className="h-4 w-4 text-green-500" />
  },
  error: {
    label: 'Erreur',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: <XCircleIcon className="h-4 w-4 text-red-500" />
  },
  running: {
    label: 'En cours',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: <ClockIcon className="h-4 w-4 text-blue-500" />
  }
};

const HistoryItem = ({ item }: { item: History }) => {
  const [open, setOpen] = useState(false);
  const [ref, isVisible] = useOnScreen<HTMLDivElement>();

  const status =
    statusMap[item.status as keyof typeof statusMap] || statusMap['ok'];

  if (!isVisible) {
    return <div ref={ref} style={{ minHeight: 62 }} />;
  }

  return (
    <div
      ref={ref}
      className="rounded-lg border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-3 select-none"
        onClick={() => setOpen(!open)}
      >
        <div
          className={cn(
            'flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold',
            status.color
          )}
        >
          {status.icon}
          {status.label}
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-200">
          <CalendarIcon className="h-4 w-4 opacity-60" />
          {new Date(item.startedAt).toLocaleString()}
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <ClockIcon className="h-4 w-4 opacity-60" />
          {item.durationMs} ms
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-zinc-400">
          <HashIcon className="h-4 w-4 opacity-60" />
          {item.id}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          aria-label={open ? 'Réduire' : 'Voir le détail'}
        >
          {open ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div
        className={cn(
          'grid overflow-hidden transition-all',
          open ? 'grid-rows-[1fr] px-4 py-2' : 'grid-rows-[0fr] p-0',
          'rounded-b-lg bg-zinc-50 dark:bg-zinc-800'
        )}
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div
          className={cn(
            'min-h-0',
            open ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
          aria-hidden={!open}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <InfoIcon className="h-4 w-4 opacity-60" />
              <span>Message :</span>
            </div>

            <pre
              className={cn(
                'overflow-x-auto rounded p-2',
                item.status === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              )}
              style={{ maxHeight: 200 }}
            >
              {typeof item.message === 'string'
                ? JSON.stringify(JSON.parse(item.message), null, 2)
                : JSON.stringify(item.message, null, 2)}
            </pre>

            {item.endedAt && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <ClockIcon className="h-4 w-4 opacity-60" />
                <span>
                  Terminé à : {new Date(item.endedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CronHistoryModal({ history }: { history: History[] }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
      <div className="sticky top-0 z-10 rounded-t-2xl bg-white pb-2 dark:bg-zinc-900">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
          <ClockIcon className="h-6 w-6 text-blue-500" />
          {"Historique d'exécution"}
        </h2>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Toutes les exécutions passées de votre cron, avec détails et statut.
        </p>
      </div>

      <div className="custom-scrollbar flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
        {history.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Aucune exécution trouvée.
          </div>
        ) : (
          history.map(item => <HistoryItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
