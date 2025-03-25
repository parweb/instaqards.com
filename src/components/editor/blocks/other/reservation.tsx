'use client';

import type { Block } from '@prisma/client';
import va from '@vercel/analytics';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { LuCheck, LuSend } from 'react-icons/lu';
import { toast } from 'sonner';
import * as z from 'zod';

import { book } from 'components/editor/blocks/other/actions';
import LoadingDots from 'components/icons/loading-dots';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { cn, json } from 'lib/utils';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';

export const input = z.object({
  placeholder: z
    .string()
    .describe(json({ label: 'Texte par default', kind: 'string' })),
  timeSlotInterval: z
    .number()
    .describe(json({ label: 'Intervalle de temps', kind: 'number' }))
});

type Day = {
  id: string;
  label: string;
  date: Date;
};

type TimeSlot = {
  id: string;
  label: string;
  date: Date;
};

const generateDays = (numberOfDays: number): Day[] =>
  Array.from({ length: numberOfDays }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    return {
      id: date.toLocaleDateString('en'),
      date,
      label:
        i === 0
          ? "aujourd'hui"
          : i === 1
            ? 'demain'
            : date.toLocaleDateString('fr-FR', { weekday: 'long' })
    };
  });

const generateTimeSlots = (
  startHour = 9,
  endHour = 18,
  intervalMinutes = 30
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  today.setHours(startHour, 0, 0, 0);

  const totalMinutes = (endHour - startHour) * 60;
  const numberOfSlots = Math.floor(totalMinutes / intervalMinutes);

  for (let i = 0; i < numberOfSlots; i++) {
    const date = new Date(today);
    const totalMinutes = i * intervalMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    date.setHours(startHour + hours, minutes);

    if (date < new Date()) continue;

    slots.push({
      id: date.toLocaleTimeString('en'),
      date,
      label: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  }

  return slots;
};

const AvalaibleDays = ({
  day,
  value,
  onChange
}: {
  day: Day;
  value: Day['id'] | undefined;
  onChange: (id: Day['id'] | undefined) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(value === day.id ? undefined : day.id)}
      className={cn(
        'group-hover:scale-100 group-hover:hover:scale-100 transition-all duration-300',
        value === day.id && 'scale-100'
      )}
    >
      <div
        className={cn(
          'aspect-video h-16 flex items-center justify-center border-4 border-stone-200 hover:border-stone-300 rounded-md flex-col bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer',
          value === day.id && 'border-black hover:border-black bg-stone-200'
        )}
      >
        <div
          className={cn(
            'text-sm font-medium text-stone-700'
            // value === day.id && 'text-white'
          )}
        >
          {day.label}
        </div>
        <div
          className={cn(
            'text-stone-500'
            // value === day.id && 'text-white/70'
          )}
        >
          {day.date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
          })}
        </div>
      </div>
    </button>
  );
};

const AvalaibleTimeSlot = ({
  timeSlot,
  value,
  onChange
}: {
  timeSlot: TimeSlot;
  value: TimeSlot['id'] | undefined;
  onChange: (id: TimeSlot['id'] | undefined) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(value === timeSlot.id ? undefined : timeSlot.id)}
      className={cn(
        'group-hover:scale-100 group-hover:hover:scale-100 transition-all duration-300',
        value === timeSlot.id && 'scale-100'
      )}
    >
      <div
        className={cn(
          'aspect-video h-16 flex items-center justify-center border-4 border-stone-200 hover:border-stone-300 rounded-md flex-col bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer',
          value === timeSlot.id &&
            'border-black hover:border-black bg-stone-200'
        )}
      >
        <div
          className={cn(
            'text-sm font-medium text-stone-700'
            // value === timeSlot.id && 'text-white'
          )}
        >
          {timeSlot.label}
        </div>
      </div>
    </button>
  );
};

export default function Reservation({
  placeholder = 'Email',
  timeSlotInterval = 30,
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  const [mode, setMode] = useState<'error' | 'success' | 'loading' | 'idle'>(
    'idle'
  );

  const [selectedDay, setSelectedDay] = useState<Day['id']>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot['id']>();
  const [selectedEmail, setSelectedEmail] = useState<string>();
  const [selectedName, setSelectedName] = useState<string>();

  return (
    <form
      className="w-full flex-1 flex flex-col gap-4 bg-white/30 backdrop-blur-sm rounded-md p-4 overflow-hidden"
      action={(form: FormData) => {
        console.log({ form: Object.fromEntries([...form.entries()]) });

        setMode('loading');

        book(form).then(res => {
          if ('error' in res) {
            toast.error(res.error);
            setMode('error');
          } else {
            va.track('Réservation enregistrée', {
              siteId: res.reservation.block?.siteId ?? '',
              email: res.reservation.email
            });

            toast.success('Réservation enregistrée!');

            setSelectedDay(undefined);
            setSelectedTimeSlot(undefined);
            setSelectedEmail(undefined);
            setSelectedName(undefined);

            setMode('success');
          }
        });
      }}
    >
      <input type="hidden" name="blockId" value={block?.id} />

      <input type="hidden" name="timeSlotInterval" value={timeSlotInterval} />
      <input type="hidden" name="day" value={selectedDay} />
      <input type="hidden" name="time" value={selectedTimeSlot} />

      <div className="flex flex-col gap-2">
        <div className="group">
          <Carousel
            className="w-full"
            opts={{ dragFree: true }}
            plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
          >
            <CarouselContent>
              {generateDays(30).map(day => (
                <CarouselItem key={`Day-${day.id}`}>
                  <AvalaibleDays
                    day={day}
                    value={selectedDay}
                    onChange={id => setSelectedDay(id)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {selectedDay && (
          <div className="group">
            <Carousel
              className="w-full"
              opts={{ dragFree: true }}
              plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
            >
              <CarouselContent>
                {generateTimeSlots(9, 18, timeSlotInterval).map(time => (
                  <CarouselItem key={`Day-${time.id}`}>
                    <AvalaibleTimeSlot
                      timeSlot={time}
                      value={selectedTimeSlot}
                      onChange={id => setSelectedTimeSlot(id)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}

        {selectedDay && selectedTimeSlot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            <div>
              <Input
                name="name"
                className="bg-white"
                placeholder="Name"
                onChange={e => setSelectedName(e.target.value)}
              />
            </div>

            <div>
              <Input
                name="email"
                className="bg-white"
                placeholder="Email"
                onChange={e => setSelectedEmail(e.target.value)}
              />
            </div>

            <div>
              <AutosizeTextarea
                name="comment"
                className="bg-white"
                placeholder="Commentaire"
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col">
        <Button
          type="submit"
          disabled={
            !selectedDay ||
            !selectedTimeSlot ||
            !selectedName ||
            !selectedEmail ||
            mode === 'loading'
          }
        >
          {mode === 'loading' ? <LoadingDots color="#808080" /> : 'Réserver'}
        </Button>
      </div>

      {mode === 'success' && (
        <div className="absolute inset-0 bg-green-600 text-white flex gap-2 items-center justify-center">
          <div>
            <LuCheck />
          </div>

          <div>Réservation enregistrée!</div>
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
