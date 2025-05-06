'use client';

import { BadgeDelta, Card, Flex, Metric, Text } from '@tremor/react';
import { useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';

import { DateRangePicker, type DateRange } from 'components/ui/date-picker';
import useTranslation from 'hooks/use-translation';
import { cn } from 'lib/utils';
import { parser as dateRangeParser } from './utils';

import {
  ComboChart,
  ComboChartEventProps
} from 'components/charts/combo-chart';

interface AffiliationChartDataPoint {
  date: string;
  Users: number;
  Clicks: number;
  Subscriptions: number;
}

interface AffiliationChartProps {
  data: AffiliationChartDataPoint[];
}

const placeholderchartdata = [
  {
    date: 'Jan 23',
    Users: 2890,
    Clicks: 2338,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'Feb 23',
    Users: 2756,
    Clicks: 2103,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'Mar 23',
    Users: 3322,
    Clicks: 2194,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'Apr 23',
    Users: 3470,
    Clicks: 2108,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'May 23',
    Users: 3475,
    Clicks: 1812,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'Jun 23',
    Users: 3129,
    Clicks: 1726,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'Jul 23',
    Users: 3490,
    Clicks: 1982,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'Aug 23',
    Users: 2903,
    Clicks: 2012,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'Sep 23',
    Users: 2643,
    Clicks: 2342,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'Oct 23',
    Users: 2837,
    Clicks: 2473,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'Nov 23',
    Users: 2954,
    Clicks: 3848,
    Subscriptions: Math.round(Math.random() * 100)
  },
  {
    date: 'Dec 23',
    Users: 3239,
    Clicks: 3736,
    Subscriptions: Math.round(Math.random() * 100)
  }
];

const getDailyGrowth = (today: number, yesterday: number) => {
  const pourcentage = ((today - yesterday) / yesterday) * 100;
  if (isNaN(pourcentage)) {
    return 0;
  }

  return pourcentage;
};

export const AffiliationChart = ({ data }: AffiliationChartProps) => {
  const translate = useTranslation();

  const [dateRange, setDateRange] = useQueryState<DateRange | null>('range', {
    shallow: false,
    parse: dateRangeParser.parse,
    serialize: dateRangeParser.serialize,
    defaultValue: null
  });

  const [, setValue] = useState<ComboChartEventProps>(null);

  const presets = useMemo(
    () => [
      {
        label: 'Today',
        dateRange: {
          from: new Date(),
          to: new Date()
        }
      },
      {
        label: 'Last 7 days',
        dateRange: {
          from: new Date(new Date().setDate(new Date().getDate() - 7)),
          to: new Date()
        }
      },
      {
        label: 'Last 30 days',
        dateRange: {
          from: new Date(new Date().setDate(new Date().getDate() - 30)),
          to: new Date()
        }
      },
      {
        label: 'Last 3 months',
        dateRange: {
          from: new Date(new Date().setDate(new Date().getDate() - 90)),
          to: new Date()
        }
      },
      {
        label: 'Last 6 months',
        dateRange: {
          from: new Date(new Date().setDate(new Date().getDate() - 180)),
          to: new Date()
        }
      },
      {
        label: 'Last 12 months',
        dateRange: {
          from: new Date(new Date().setDate(new Date().getDate() - 365)),
          to: new Date()
        }
      },
      {
        label: 'Month to date',
        dateRange: {
          from: new Date(new Date().setDate(1)),
          to: new Date()
        }
      }
    ],
    []
  );

  const handleDateRangeChange = (selectedRange: DateRange | undefined) => {
    if (selectedRange?.from && selectedRange?.to) {
      const rangeToSet: DateRange = {
        from: new Date(selectedRange.from.setHours(0, 0, 0, 0)),
        to: new Date(selectedRange.to.setHours(23, 59, 59, 999))
      };

      setDateRange(rangeToSet);
    } else {
      setDateRange(null);
    }
  };

  const chartdata = data.length > 0 ? data : placeholderchartdata;

  const dailyGrowth = {
    Users: getDailyGrowth(
      chartdata.at(-1)?.Users ?? 0,
      chartdata.at(-2)?.Users ?? 0
    ),
    Clicks: getDailyGrowth(
      chartdata.at(-1)?.Clicks ?? 0,
      chartdata.at(-2)?.Clicks ?? 0
    ),
    Subscriptions: getDailyGrowth(
      chartdata.at(-1)?.Subscriptions ?? 0,
      chartdata.at(-2)?.Subscriptions ?? 0
    )
  };

  return (
    <Card className="dark:bg-stone-900 relative">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="border border-stone-200 p-4 rounded-md shadow-sm">
            <Text>Utilisateurs</Text>

            <Flex justifyContent="between" alignItems="center">
              <Flex
                className="space-x-3 truncate"
                justifyContent="start"
                alignItems="baseline"
              >
                <Metric className="font-cal">
                  {Intl.NumberFormat(
                    { en: 'us', fr: 'fr', it: 'it', es: 'es' }[translate.lang]
                  )
                    .format(data.reduce((acc, curr) => acc + curr.Users, 0))
                    .toString()}
                </Metric>

                {isFinite(dailyGrowth.Users) && (
                  <BadgeDelta
                    deltaType={
                      dailyGrowth.Users >= 0
                        ? 'moderateIncrease'
                        : 'moderateDecrease'
                    }
                    className={cn('text-white dark:bg-opacity-50', {
                      'dark:bg-green-900': dailyGrowth.Users >= 0,
                      'dark:bg-red-900': dailyGrowth.Users < 0
                    })}
                  >
                    {dailyGrowth.Users.toFixed(2)}%
                  </BadgeDelta>
                )}
              </Flex>
            </Flex>
          </div>

          <div className="border border-stone-200 p-4 rounded-md shadow-sm">
            <Text>Clicks</Text>

            <Flex justifyContent="between" alignItems="center">
              <Flex
                className="space-x-3 truncate"
                justifyContent="start"
                alignItems="baseline"
              >
                <Metric className="font-cal">
                  {Intl.NumberFormat(
                    { en: 'us', fr: 'fr', it: 'it', es: 'es' }[translate.lang]
                  )
                    .format(data.reduce((acc, curr) => acc + curr.Clicks, 0))
                    .toString()}
                </Metric>

                {isFinite(dailyGrowth.Clicks) && (
                  <BadgeDelta
                    deltaType={
                      dailyGrowth.Clicks >= 0
                        ? 'moderateIncrease'
                        : 'moderateDecrease'
                    }
                    className={cn('text-white dark:bg-opacity-50', {
                      'dark:bg-green-900': dailyGrowth.Clicks >= 0,
                      'dark:bg-red-900': dailyGrowth.Clicks < 0
                    })}
                  >
                    {dailyGrowth.Clicks.toFixed(2)}%
                  </BadgeDelta>
                )}
              </Flex>
            </Flex>
          </div>

          <div className="border border-stone-200 p-4 rounded-md shadow-sm">
            <Text>Abonnements</Text>

            <Flex justifyContent="between" alignItems="center">
              <Flex
                className="space-x-3 truncate"
                justifyContent="start"
                alignItems="baseline"
              >
                <Metric className="font-cal">
                  {Intl.NumberFormat(
                    { en: 'en', fr: 'fr', it: 'it', es: 'es' }[
                      translate.lang
                    ] || 'en',
                    { style: 'currency', currency: 'EUR' }
                  )
                    .format(
                      data.reduce(
                        (acc, curr) => acc + (curr.Subscriptions ?? 0),
                        0
                      )
                    )
                    .toString()}
                </Metric>

                {isFinite(dailyGrowth.Subscriptions) && (
                  <BadgeDelta
                    deltaType={
                      dailyGrowth.Subscriptions >= 0
                        ? 'moderateIncrease'
                        : 'moderateDecrease'
                    }
                    className={cn('text-white dark:bg-opacity-50', {
                      'dark:bg-green-900': dailyGrowth.Subscriptions >= 0,
                      'dark:bg-red-900': dailyGrowth.Subscriptions < 0
                    })}
                  >
                    {dailyGrowth.Subscriptions.toFixed(2)}%
                  </BadgeDelta>
                )}
              </Flex>
            </Flex>
          </div>
        </div>

        <div>
          <DateRangePicker
            presets={presets}
            value={dateRange}
            onChange={handleDateRangeChange}
            className="max-w-sm"
          />
        </div>
      </div>

      <ComboChart
        data={chartdata}
        index="date"
        enableBiaxial={true}
        onValueChange={v => setValue(v)}
        barSeries={{
          categories: ['Users', 'Clicks']
        }}
        lineSeries={{
          categories: ['Subscriptions'],
          showYAxis: true,
          valueFormatter: (value: number) =>
            Intl.NumberFormat(
              { en: 'en', fr: 'fr', it: 'it', es: 'es' }[translate.lang] ||
                'en',
              { style: 'currency', currency: 'EUR' }
            ).format(value),
          colors: ['gray']
        }}
      />

      {data.length === 0 && (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-80 bg-white" />

          <div className="absolute inset-0 flex items-center justify-center">
            <p className="p-4 text-center text-gray-500 bg-amber-500/50 backdrop-blur-sm rounded-md">
              Pas de données disponibles
            </p>
          </div>
        </>
      )}
    </Card>
  );
};
