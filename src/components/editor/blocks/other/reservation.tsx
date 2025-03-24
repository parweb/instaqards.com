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
import { CarouselContent, CarouselItem } from 'components/ui/carousel';
import { Carousel } from 'components/ui/carousel';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

export const input = z.object({
  placeholder: z
    .string()
    .describe(json({ label: 'Texte par default', kind: 'string' }))
});

const AvalaibleDays = ({ day }: { day: { id: number; label: string } }) => {
  return (
    <div className="aspect-square flex items-center justify-center border border-stone-200 rounded-md">
      {day.label}
    </div>
  );
};

export default function Reservation({
  placeholder = 'Email',
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  const [mode, setMode] = useState<'error' | 'success' | 'loading' | 'idle'>(
    'idle'
  );

  return (
    <form
      className="relative overflow-hidden flex-1 flex gap-2 items-center bg-white rounded-md p-2"
      action={form => {
        // console.log({ form: Object.fromEntries([...form.entries()]) });
        // setMode('loading');
        // subscribe(form).then(res => {
        //   if ('error' in res) {
        //     toast.error(res.error);
        //     setMode('error');
        //   } else {
        //     va.track('Subscribe to newsletter', {
        //       siteId: res.subscriber.siteId,
        //       email: res.subscriber.email
        //     });
        //     toast.success('Email added to list!');
        //     setMode('success');
        //   }
        // });
      }}
    >
      <input type="hidden" name="blockId" value={block?.id} />

      <Carousel
        opts={{ dragFree: true }}
        plugins={[WheelGesturesPlugin({ forceWheelAxis: undefined /* 'y' */ })]}
      >
        <CarouselContent>
          {[
            { id: 1, label: 'lundi' },
            { id: 2, label: 'mardi' },
            { id: 3, label: 'mercredi' },
            { id: 4, label: 'jeudi' },
            { id: 5, label: 'vendredi' },
            { id: 6, label: 'samedi' },
            { id: 7, label: 'dimanche' }
          ].map(day => (
            <AvalaibleDays key={day.id} day={day} />
          ))}
        </CarouselContent>
      </Carousel>

      {mode === 'success' && (
        <div className="absolute inset-0 bg-green-600 text-white flex gap-2 items-center justify-center">
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
