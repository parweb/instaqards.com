'use client';

import { motion } from 'motion/react';
import { useState, useTransition } from 'react';

import { onboard } from 'actions/onboard';
import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import useTranslation from 'hooks/use-translation';

export function Begin() {
  const translate = useTranslation();

  const [isPending, startTransition] = useTransition();

  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        startTransition(() => {
          onboard({
            subdomain: String(form.get('subdomain')),
            email: String(form.get('email'))
          }).then(data => {
            setError(data.error || null);
          });
        });
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex w-full">
        <input
          name="subdomain"
          type="text"
          placeholder={translate('page.home.pricing.start.placeholder')}
          autoCapitalize="off"
          autoComplete="off"
          pattern="[a-zA-Z0-9\-]+"
          maxLength={32}
          required
          className="w-full rounded-l-lg border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          onChange={e => setSubdomain(e.target.value)}
          value={subdomain}
        />

        <div className="flex items-center rounded-r-lg border border-l-0 border-stone-200 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
          .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
        </div>
      </div>

      {subdomain !== '' && (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Input
            type="email"
            name="email"
            required
            placeholder={translate('page.home.pricing.start.email.placeholder')}
          />
        </motion.div>
      )}

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <LoadingDots color="#808080" />
        ) : (
          translate('page.home.pricing.start')
        )}
      </Button>
    </form>
  );
}
