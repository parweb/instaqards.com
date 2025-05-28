'use client';

import { AreaChart, BadgeDelta, Card, Flex, Metric, Text } from '@tremor/react';
import { useMemo, useState } from 'react';
import { DateRangePicker, type DateRange } from 'components/ui/date-picker';
import useTranslation from 'hooks/use-translation';

const filterDataByDateRange = (
  data: { date: string; Users: number }[],
  startDate: DateRange['from'],
  endDate: DateRange['to']
) => {
  return data.filter(item => {
    const itemDate = new Date(item.date);
    if (!startDate || !endDate) return true;
    return itemDate >= startDate && itemDate <= endDate;
  });
};

interface NewUsersChartProps {
  data: { date: string; Users: number }[];
  total: number;
  dailyGrowth: number;
}

export const NewUsersChart = ({
  data,
  total,
  dailyGrowth
}: NewUsersChartProps) => {
  const translate = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [filteredData, setFilteredData] = useState(data);

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
        label: 'Month to date',
        dateRange: {
          from: new Date(new Date().setDate(1)),
          to: new Date()
        }
      }
    ],
    []
  );

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    const range = {
      from: dateRange?.from
        ? new Date(dateRange.from.setHours(0, 0, 0, 0))
        : undefined,
      to: dateRange?.to
        ? new Date(dateRange.to.setHours(23, 59, 59, 999))
        : undefined
    };

    setDateRange(range);

    if (dateRange) {
      setFilteredData(filterDataByDateRange(data, range.from, range.to));
    }
  };

  return (
    <Card className="dark:bg-stone-900">
      <Text>Nouveaux utilisateurs</Text>

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
            className="dark:bg-opacity-50 dark:bg-green-900 dark:text-green-400"
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
        data={filteredData}
        index="date"
        valueFormatter={(number: number) =>
          Intl.NumberFormat(
            { en: 'us', fr: 'fr', it: 'it', es: 'es' }[translate.lang]
          )
            .format(number)
            .toString()
        }
        categories={['Users']}
        colors={['indigo']}
        showXAxis={true}
        showGridLines={false}
        startEndOnly={true}
        showYAxis={false}
        showLegend={false}
      />
    </Card>
  );
};
