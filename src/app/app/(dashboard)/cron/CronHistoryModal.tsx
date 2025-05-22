'use client';

import { History } from '@prisma/client';
import { useState } from 'react';

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

const statusMap = {
  ok: {
    label: 'Succès',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: <CheckCircle2Icon className="w-4 h-4 text-green-500" />
  },
  error: {
    label: 'Erreur',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: <XCircleIcon className="w-4 h-4 text-red-500" />
  },
  running: {
    label: 'En cours',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: <ClockIcon className="w-4 h-4 text-blue-500" />
  }
};

const HistoryItem = ({ item }: { item: History }) => {
  const [open, setOpen] = useState(false);
  
  const status =
    statusMap[item.status as keyof typeof statusMap] || statusMap['ok'];

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold',
            status.color
          )}
        >
          {status.icon}
          {status.label}
        </div>
        <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-200 text-xs">
          <CalendarIcon className="w-4 h-4 opacity-60" />
          {new Date(item.startedAt).toLocaleString()}
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <ClockIcon className="w-4 h-4 opacity-60" />
          {item.durationMs} ms
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-400 ml-auto">
          <HashIcon className="w-4 h-4 opacity-60" />
          {item.id}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          aria-label={open ? 'Réduire' : 'Voir le détail'}
        >
          {open ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div
        className={cn(
          'overflow-hidden transition-all grid',
          open ? 'grid-rows-[1fr] py-2 px-4' : 'grid-rows-[0fr] p-0',
          'bg-zinc-50 dark:bg-zinc-800 rounded-b-lg'
        )}
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div
          className={cn(
            'min-h-0',
            open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          aria-hidden={!open}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <InfoIcon className="w-4 h-4 opacity-60" />
              <span>Message :</span>
            </div>

            <pre
              className={cn(
                'rounded p-2 overflow-x-auto',
                item.status === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              )}
              style={{ maxHeight: 200 }}
            >
              {typeof item.message === 'string'
                ? item.message
                : JSON.stringify(item.message, null, 2)}
            </pre>

            {item.endedAt && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <ClockIcon className="w-4 h-4 opacity-60" />
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
    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl max-w-2xl w-full mx-auto">
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 rounded-t-2xl pb-2">
        <h2 className="font-extrabold text-2xl text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-blue-500" />
          Historique d'exécution
        </h2>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Toutes les exécutions passées de votre cron, avec détails et statut.
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto flex flex-col gap-3 pr-1 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Aucune exécution trouvée.
          </div>
        ) : (
          history.map(item => <HistoryItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
