'use client';

import { AreaChart, BadgeDelta, Card, Flex, Metric, Text } from '@tremor/react';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';

import { DateRangePicker, type DateRange } from 'components/ui/date-picker';
import { subYears } from 'date-fns';
import { rangeParser as dateRangeParser } from 'helpers/rangeParser';
import useTranslation from 'hooks/use-translation';

const filterDataByDateRange = (
  data: { date: string; Clicks: number }[],
  startDate: DateRange['from'],
  endDate: DateRange['to']
) => {
  return data.filter(item => {
    const itemDate = new Date(item.date);

    if (!startDate || !endDate) {
      return true;
    }

    return itemDate >= startDate && itemDate <= endDate;
  });
};

export default function OverviewStats({
  chartdata,
  total,
  dailyGrowth
}: {
  chartdata: { date: string; Clicks: number }[];
  total: number;
  dailyGrowth: number;
}) {
  const translate = useTranslation();

  const [dateRange, setDateRange] = useQueryState<DateRange | null>('range', {
    shallow: false,
    parse: dateRangeParser.parse,
    serialize: dateRangeParser.serialize,
    defaultValue: null
  });

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
          from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
          to: new Date()
        }
      },
      {
        label: 'Last 6 months',
        dateRange: {
          from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          to: new Date()
        }
      },
      {
        label: 'Month to date',
        dateRange: {
          from: new Date(new Date().setDate(1)),
          to: new Date()
        }
      },
      {
        label: 'Year to date',
        dateRange: {
          from: new Date(
            new Date().setFullYear(new Date().getFullYear(), 0, 1)
          ),
          to: new Date()
        }
      },
      {
        label: 'All time',
        dateRange: {
          from: new Date(subYears(new Date(), 100)),
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

  return (
    <div className="grid gap-6 sm:grid-cols-1">
      <Card className="dark:bg-stone-900!">
        <Text>{translate('component.overview-stats.title')}</Text>

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
                .format(total)
                .toString()}
            </Metric>

            <BadgeDelta
              deltaType={
                dailyGrowth >= 0 ? 'moderateIncrease' : 'moderateDecrease'
              }
              className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
            >
              {dailyGrowth.toFixed(2)}%
            </BadgeDelta>
          </Flex>

          <DateRangePicker
            presets={presets}
            value={dateRange}
            onChange={handleDateRangeChange}
            className="max-w-sm"
          />
        </Flex>

        <AreaChart
          className="mt-6 h-28"
          data={chartdata}
          index="date"
          valueFormatter={(number: number) =>
            Intl.NumberFormat(
              { en: 'us', fr: 'fr', it: 'it', es: 'es' }[translate.lang]
            )
              .format(number)
              .toString()
          }
          categories={['Clicks', 'Visitors']}
          colors={['indigo', 'cyan']}
          showXAxis={true}
          showGridLines={false}
          startEndOnly={true}
          showYAxis={false}
          showLegend={false}
        />
      </Card>
    </div>
  );
}
