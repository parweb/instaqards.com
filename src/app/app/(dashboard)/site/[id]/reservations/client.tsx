'use client';

import type { Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState, type RefObject } from 'react';
import { useDayRender, type DayProps } from 'react-day-picker';

import { Badge } from 'components/ui/badge';
import { Calendar as CalendarUi } from 'components/ui/calendar';
import { cn } from 'lib/utils';

export const Calendar = ({
  value,
  reservations
}: {
  value: Date | undefined;
  reservations: Prisma.ReservationGetPayload<{
    select: {
      dateStart: true;
    };
  }>[];
}) => {
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(value);

  return (
    <CalendarUi
      components={{
        Day: ({ date, displayMonth }: DayProps) => {
          const buttonRef = React.useRef<HTMLButtonElement>(null);
          const { activeModifiers, buttonProps, divProps, isButton, isHidden } =
            useDayRender(
              date,
              displayMonth,
              buttonRef as RefObject<HTMLButtonElement>
            );

          const { selected, today, disabled, range_middle } = activeModifiers;

          const hasReservation = (date: Date) =>
            reservations.some(
              reservation =>
                reservation.dateStart.toDateString() === date.toDateString()
            );

          if (isHidden) {
            return <></>;
          }

          if (!isButton) {
            return (
              <div
                {...divProps}
                className={cn(
                  'flex items-center justify-center',
                  divProps.className
                )}
              />
            );
          }

          const {
            children: buttonChildren,
            className: buttonClassName,
            ...buttonPropsRest
          } = buttonProps;

          return (
            <button
              ref={buttonRef}
              {...buttonPropsRest}
              type="button"
              className={cn('relative m-0.5', buttonClassName, {
                'border-primary border': hasReservation(date)
              })}
            >
              {buttonChildren}

              {today && (
                <span
                  className={cn(
                    'absolute inset-x-1/2 bottom-1.5 h-0.5 w-4 -translate-x-1/2 rounded-[2px]',
                    {
                      'bg-blue-500 dark:bg-blue-500': !selected,
                      'bg-white! dark:bg-gray-950!': selected,
                      'bg-gray-400! dark:bg-gray-600!':
                        selected && range_middle,
                      'bg-gray-400 text-gray-400 dark:bg-gray-400 dark:text-gray-600':
                        disabled
                    }
                  )}
                />
              )}

              {hasReservation(date) && (
                <div className="absolute right-0 bottom-full left-0 flex translate-y-1/2 items-start justify-center">
                  <Badge
                    className="rounded-full px-1 py-0 text-xs"
                    variant="success"
                  >
                    {
                      reservations.filter(
                        reservation =>
                          reservation.dateStart.toDateString() ===
                          date?.toDateString()
                      ).length
                    }
                  </Badge>
                </div>
              )}
            </button>
          );
        }
      }}
      className="rounded-md border"
      mode="single"
      selected={date}
      onSelect={date => {
        setDate(date);
        router.push(`?date=${date?.toISOString()}`);
      }}
    />
  );
};
