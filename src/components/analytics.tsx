'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import {
  AreaChart,
  BarList,
  Bold,
  Card,
  Flex,
  Grid,
  Text,
  Title
} from '@tremor/react';

import { DateRangePicker, type DateRange } from 'components/ui/date-picker';
import useTranslation from 'hooks/use-translation';

type Tuple = { name: string; value: number; code?: string };

// Helper function to filter data by date range
const filterDataByDateRange = (
  data: { date: string; Clicks: number; Visitors?: number }[],
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

export default function Analytics({
  chartdata
}: {
  chartdata: { date: string; Clicks: number; Visitors?: number }[];
}) {
  const translate = useTranslation();

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [filteredData, setFilteredData] = useState(chartdata);

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
      }
    ],
    []
  );

  // Update filtered data when date range changes
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
      setFilteredData(filterDataByDateRange(chartdata, range.from, range.to));
    }
  };

  const links: Tuple[] = [
    // { name: '/platforms-starter-kit', value: 1230 },
    // { name: '/vercel-is-now-bercel', value: 751 },
    // { name: '/nextjs-conf', value: 471 },
    // { name: '/150m-series-d', value: 280 },
    // { name: '/about', value: 78 }
  ];

  const referrers: Tuple[] = [
    // { name: 't.co', value: 453 },
    // { name: 'vercel.com', value: 351 },
    // { name: 'linkedin.com', value: 271 },
    // { name: 'google.com', value: 191 },
    // {
    //   name: 'news.ycombinator.com',
    //   value: 71
    // }
  ];

  const countries: Tuple[] = [
    // { name: 'United States of America', value: 789, code: 'US' },
    // { name: 'India', value: 676, code: 'IN' },
    // { name: 'Germany', value: 564, code: 'DE' },
    // { name: 'United Kingdom', value: 234, code: 'GB' },
    // { name: 'Spain', value: 191, code: 'ES' }
  ];

  const categories = [
    {
      title: 'components.analytics.link.title',
      subtitle: 'components.analytics.link.subtitle',
      data: links
    },
    {
      title: 'components.analytics.source.title',
      subtitle: 'components.analytics.source.subtitle',
      data: referrers
    },
    {
      title: 'components.analytics.country.title',
      subtitle: 'components.analytics.country.subtitle',
      data: countries
    }
  ];

  return (
    <div className="grid gap-6">
      <Card>
        <Flex justifyContent="between" alignItems="center">
          <Title>Clicks</Title>

          <DateRangePicker
            presets={presets}
            value={dateRange}
            onChange={handleDateRangeChange}
            className="max-w-sm"
          />
        </Flex>

        <AreaChart
          className="mt-4 h-72"
          index="date"
          categories={['Clicks', 'Visitors']}
          colors={['indigo', 'cyan']}
          data={filteredData.map(({ date, Clicks, Visitors }) => ({
            date:
              new Date(date).getHours() === 0
                ? format(new Date(date), 'dd MMM')
                : `${format(new Date(date), 'HH')}h`,
            Clicks,
            Visitors
          }))}
          enableLegendSlider
          valueFormatter={(number: number) =>
            Intl.NumberFormat(
              { en: 'us', fr: 'fr', it: 'it', es: 'es' }[translate.lang]
            )
              .format(number)
              .toString()
          }
        />
      </Card>

      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
        {categories.map(({ title, subtitle, data }) => (
          <Card key={title} className="max-w-lg">
            {/* @ts-ignore */}
            <Title>{translate(title)}</Title>

            <Flex className="mt-4">
              <Text>
                {/* @ts-ignore */}
                <Bold>{translate(subtitle)}</Bold>
              </Text>

              <Text>
                <Bold>{translate('components.analytics.clicks')}</Bold>
              </Text>
            </Flex>

            <BarList
              className="mt-2"
              data={data.map(({ name, value, code }) => ({
                name,
                value,
                icon: () => {
                  if (title === 'components.analytics.source.title') {
                    return (
                      <Image
                        src={`https://www.google.com/s2/favicons?sz=64&domain_url=${name}`}
                        alt={name}
                        className="mr-2.5"
                        width={20}
                        height={20}
                      />
                    );
                  }

                  if (title === 'components.analytics.country.title') {
                    return (
                      <Image
                        src={`https://flag.vercel.app/m/${code}.svg`}
                        className="mr-2.5"
                        alt={code ?? ''}
                        width={24}
                        height={16}
                      />
                    );
                  }

                  return null;
                }
              }))}
            />
          </Card>
        ))}
      </Grid>
    </div>
  );
}
