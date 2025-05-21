'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { addCron, editCron } from 'lib/actions';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from 'components/ui/form';

interface CronFormValues {
  name: string;
  cronExpr: string;
  timezone: string;
  modulePath: string;
  functionName: string;
}

const defaultValues: CronFormValues = {
  name: '',
  cronExpr: '',
  timezone: 'Europe/Paris',
  modulePath: '',
  functionName: ''
};

export default function CronModalForm({ cron }: { cron?: any }) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const modal = useModal();

  const form = useForm<CronFormValues>({
    defaultValues: cron
      ? {
          name: cron.name,
          cronExpr: cron.cronExpr,
          timezone: cron.timezone,
          modulePath: cron.modulePath,
          functionName: cron.functionName
        }
      : defaultValues,
    mode: 'onBlur'
  });

  async function onSubmit(values: CronFormValues) {
    startTransition(async () => {
      if (cron) {
        await editCron(cron.id, values);
      } else {
        await addCron(values);
      }

      modal?.hide();
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-xl p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow"
      >
        <h2 className="font-bold text-lg mb-2">
          {cron ? 'Éditer le cron' : 'Ajouter un cron'}
        </h2>

        <FormField
          control={form.control}
          name="name"
          rules={{ required: 'Le nom est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} autoFocus disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cronExpr"
          rules={{ required: "L'expression cron est requise" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expression cron</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          rules={{ required: 'Le timezone est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="modulePath"
          rules={{ required: 'Le chemin du module est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module path</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="functionName"
          rules={{ required: 'Le nom de la fonction est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Function name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {cron ? 'Enregistrer' : 'Ajouter'}
        </Button>
      </form>
    </Form>
  );
}
