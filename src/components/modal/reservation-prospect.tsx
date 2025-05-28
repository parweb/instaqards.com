'use client';

import type { User } from '@prisma/client';
import va from '@vercel/analytics';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuCalendar, LuHandshake, LuPhone, LuVideo } from 'react-icons/lu';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { formatPhoneNumber } from 'helpers/formatPhoneNumber';
import useTranslation from 'hooks/use-translation';
import { bookProspect } from 'lib/actions';
import { cn } from 'lib/utils';
import { useFormStatus } from 'react-dom';
import { useModal } from './provider';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

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

    // On affiche tous les créneaux, même ceux dans le passé
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
  // eslint-disable-next-line no-unused-vars
  onChange: (id: Day['id'] | undefined) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(value === day.id ? undefined : day.id)}
      className={cn(
        'transition-all duration-300 group-hover:scale-100 hover:group-hover:scale-100',
        value === day.id && 'scale-100'
      )}
    >
      <div
        className={cn(
          'flex aspect-video h-16 cursor-pointer flex-col items-center justify-center rounded-md border-4 border-stone-200 bg-white shadow-xs transition-all duration-300 hover:border-stone-300 hover:shadow-md',
          value === day.id && 'border-black bg-stone-200 hover:border-black'
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
  // eslint-disable-next-line no-unused-vars
  onChange: (id: TimeSlot['id'] | undefined) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(value === timeSlot.id ? undefined : timeSlot.id)}
      className={cn(
        'transition-all duration-300 group-hover:scale-100 hover:group-hover:scale-100',
        value === timeSlot.id && 'scale-100'
      )}
    >
      <div
        className={cn(
          'flex aspect-video h-16 cursor-pointer flex-col items-center justify-center rounded-md border-4 border-stone-200 bg-white shadow-xs transition-all duration-300 hover:border-stone-300 hover:shadow-md',
          value === timeSlot.id &&
            'border-black bg-stone-200 hover:border-black'
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

export default function ProspectReservationModal({
  user,
  type
}: {
  user: Pick<User, 'id' | 'email' | 'name' | 'phone'>;
  type: 'PHONE' | 'VISIO' | 'REMINDER' | 'PHYSIC';
}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState<{
    daysRange: number;
    timeSlotInterval: number;
    selectedDay: Day['id'] | undefined;
    selectedTimeSlot: TimeSlot['id'] | undefined;
    selectedEmail: string | undefined;
    selectedName: string | undefined;
    type: 'PHONE' | 'VISIO' | 'REMINDER' | 'PHYSIC';
  }>({
    daysRange: 30,
    timeSlotInterval: 15,
    selectedDay: undefined,
    selectedTimeSlot: undefined,
    selectedEmail: undefined,
    selectedName: undefined,
    type
  });

  return (
    <form
      action={async (data: FormData) =>
        bookProspect(data).then(res => {
          if (res.error) {
            toast.error(res.error);
            console.error(res.error);
          } else {
            router.refresh();
            modal?.hide();
            toast.success('Prospects booked!');
            va.track('Prospects booked');
          }
        })
      }
      className="w-full rounded-md bg-white md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:bg-stone-800 dark:md:border-stone-700"
    >
      <input type="hidden" name="type" value={data.type} />
      <input type="hidden" name="email" value={user.email} />
      {user.name && <input type="hidden" name="name" value={user.name} />}

      <input
        type="hidden"
        name="timeSlotInterval"
        value={data.timeSlotInterval}
      />
      <input type="hidden" name="day" value={data.selectedDay} />
      <input type="hidden" name="time" value={data.selectedTimeSlot} />

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Select
            value={data.type}
            onValueChange={async value => {
              const newType = value as
                | 'PHONE'
                | 'VISIO'
                | 'REMINDER'
                | 'PHYSIC';
              setData(prev => ({ ...prev, type: newType }));
            }}
          >
            <SelectTrigger className="bg-stone-900 text-white">
              <SelectValue
                className="bg-dark-tremor-background"
                placeholder="Type"
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="PHONE">
                <LuPhone />
                Phone
              </SelectItem>
              <SelectItem value="VISIO">
                <LuVideo />
                Visio
              </SelectItem>
              <SelectItem value="REMINDER">
                <LuCalendar />
                Reminder
              </SelectItem>
              <SelectItem value="PHYSIC">
                <LuHandshake />
                In person
              </SelectItem>
            </SelectContent>
          </Select>

          {data.type === 'PHONE' && (
            <div className="rounded-md bg-emerald-400 p-2 text-sm text-stone-700">
              <a
                href={`tel:${formatPhoneNumber(user.phone).replaceAll(' ', '')}`}
              >
                {formatPhoneNumber(user.phone)}
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="group">
            <Carousel
              className="w-full"
              opts={{ dragFree: true }}
              plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
            >
              <CarouselContent>
                {generateDays(data.daysRange).map(day => (
                  <CarouselItem key={`Day-${day.id}`}>
                    <AvalaibleDays
                      day={day}
                      value={data.selectedDay}
                      onChange={id =>
                        setData(prev => ({ ...prev, selectedDay: id }))
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {data.selectedDay && (
            <div className="group">
              <Carousel
                className="w-full"
                opts={{ dragFree: true }}
                plugins={[WheelGesturesPlugin({ forceWheelAxis: 'y' })]}
              >
                <CarouselContent>
                  {generateTimeSlots(9, 18, data.timeSlotInterval).map(time => (
                    <CarouselItem key={`Day-${time.id}`}>
                      <AvalaibleTimeSlot
                        timeSlot={time}
                        value={data.selectedTimeSlot}
                        onChange={id =>
                          setData(prev => ({ ...prev, selectedTimeSlot: id }))
                        }
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          {data.selectedDay && data.selectedTimeSlot && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2"
            >
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
      </div>

      <div className="flex flex-col items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10 dark:border-stone-700 dark:bg-stone-800">
        <ProspectReservationButton />
      </div>
    </form>
  );
}

function ProspectReservationButton() {
  const translate = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.prospect.reservation.button')}</p>
      )}
    </Button>
  );
}
