'use client';

import { atom, useAtomValue } from 'jotai';
import { useActionState } from 'react';

import { Button } from 'components/ui/button';
import { Switch } from 'components/ui/switch';
import * as cronJob from 'services/cron-job';

export const $cron = atom(async () => {
  const result = await fetch('/api/cron').then(res => res.json());
  return result;
});

export const CronJobStatus = () => {
  const cron = useAtomValue($cron);

  const [state, action, isPending] = useActionState(
    async (checked: boolean) => {
      const mutator = checked ? cronJob.disable() : cronJob.active();

      await mutator.catch((error: unknown) => {
        console.error(error);
        return null;
      });

      return await cronJob.get().then(job => job.enabled);
    },
    cron?.enabled ?? false
  );

  return (
    <form action={action}>
      <Button variant="ghost" size="icon" type="submit">
        <Switch checked={state} disabled={isPending} />
      </Button>
    </form>
  );
};
