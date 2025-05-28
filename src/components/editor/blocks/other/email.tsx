'use client';

import va from '@vercel/analytics';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { LuCheck, LuSend } from 'react-icons/lu';
import { toast } from 'sonner';
import * as z from 'zod';

import type { Block } from '@prisma/client';
import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { json } from 'lib/utils';
import { subscribe } from 'components/editor/blocks/other/actions';

export const input = z.object({
  placeholder: z
    .string()
    .describe(json({ label: 'Texte par default', kind: 'string' }))
});

export default function Email({
  placeholder = 'Email',
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  const [mode, setMode] = useState<'error' | 'success' | 'loading' | 'idle'>(
    'idle'
  );

  return (
    <form
      className="relative flex flex-1 items-center gap-2 overflow-hidden rounded-md bg-white p-2"
      action={form => {
        setMode('loading');

        subscribe(form).then(res => {
          if ('error' in res) {
            toast.error(res.error);
            setMode('error');
          } else {
            va.track('Subscribe to newsletter', {
              siteId: res.subscriber.siteId,
              email: res.subscriber.email
            });

            toast.success('Email added to list!');
            setMode('success');
          }
        });
      }}
    >
      <input type="hidden" name="blockId" value={block?.id} />

      <div className="flex-1">
        <Input type="email" name="email" placeholder={placeholder} />
      </div>

      <div>
        <FormButton />
      </div>

      {mode === 'success' && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-green-600 text-white">
          <div>
            <LuCheck />
          </div>

          <div>Email added to list!</div>
        </div>
      )}
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit">
      {pending ? <LoadingDots color="#808080" /> : <LuSend />}
    </Button>
  );
}
