'use client';

import { AreaChart, BadgeDelta, Card, Flex, Metric, Text } from '@tremor/react';

import useTranslation from 'hooks/use-translation';

export default function OverviewStats({
  chartdata,
  total
}: {
  chartdata: { date: string; Clicks: number }[];
  total: number;
}) {
  const translate = useTranslation();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card className="dark:!bg-stone-900">
        <Text>{translate('component.overview-stats.title')}</Text>

        <Flex
          className="space-x-3 truncate"
          justifyContent="start"
          alignItems="baseline"
        >
          <Metric className="font-cal">
            {Intl.NumberFormat({ en: 'us', fr: 'fr' }[translate.lang])
              .format(total)
              .toString()}
          </Metric>

          <BadgeDelta
            deltaType="moderateIncrease"
            className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
          >
            34.3%
          </BadgeDelta>
        </Flex>

        <AreaChart
          className="mt-6 h-28"
          data={chartdata}
          index="date"
          valueFormatter={(number: number) =>
            Intl.NumberFormat({ en: 'us', fr: 'fr' }[translate.lang])
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
