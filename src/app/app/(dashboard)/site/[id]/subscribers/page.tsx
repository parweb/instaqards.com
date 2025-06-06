import { UserRole } from '@prisma/client';
import { notFound } from 'next/navigation';
import { LuArrowUpRight, LuMail, LuUsers, LuUserPlus, LuCalendar } from 'react-icons/lu';

import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Badge } from 'components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { db } from 'helpers/db';
import { getAuth } from 'lib/auth';
import { uri } from 'settings';

export default async function SiteSubscribers(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const [auth, site] = await Promise.all([
    getAuth(),
    db.site.findUnique({
      select: {
        id: true,
        name: true,
        userId: true,
        subdomain: true
      },
      where: { id: decodeURIComponent(params.id) }
    })
  ]);

  if (
    !site ||
    (site.userId !== auth.id &&
      !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(auth.role))
  ) {
    notFound();
  }

  const subscribers = await db.subscriber.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true
    },
    where: { siteId: site.id },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate statistics
  const totalSubscribers = subscribers.length;
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  const newThisMonth = subscribers.filter(
    sub => new Date(sub.createdAt) >= thisMonth
  ).length;

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  lastMonth.setDate(1);
  lastMonth.setHours(0, 0, 0, 0);
  
  const endLastMonth = new Date(thisMonth);
  endLastMonth.setTime(endLastMonth.getTime() - 1);
  
  const newLastMonth = subscribers.filter(
    sub => new Date(sub.createdAt) >= lastMonth && new Date(sub.createdAt) <= endLastMonth
  ).length;

  const growthRate = newLastMonth > 0 ? ((newThisMonth - newLastMonth) / newLastMonth * 100) : 0;

  return (
    <div className="flex flex-1 flex-col gap-6 self-stretch p-8">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <h1 className="font-cal text-xl font-bold sm:text-3xl">
          Subscribers for {site.name}
        </h1>

        <a
          href={uri.site(site).link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
        >
          {uri.site(site).title} <LuArrowUpRight />
        </a>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscribers
            </CardTitle>
            <LuUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              All time subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New This Month
            </CardTitle>
            <LuUserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Growth Rate
            </CardTitle>
            <LuCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Month over month growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers List */}
      <div className="flex flex-1 flex-col gap-4 self-stretch">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Subscribers</h2>
          <Badge variant="secondary">{totalSubscribers} total</Badge>
        </div>

        {subscribers.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
            <div className="rounded-full bg-gray-100 p-3">
              <LuMail className="h-6 w-6 text-gray-400" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900">No subscribers yet</h3>
              <p className="text-sm text-gray-500">
                {"When people subscribe to your site, they'll appear here."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subscribers.map(subscriber => {
              const initials = subscriber.email
                .split('@')[0]
                .substring(0, 2)
                .toUpperCase();
              const avatarUrl = `https://avatar.vercel.sh/${subscriber.email}?size=40`;
              
              return (
                <Card key={subscriber.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={avatarUrl} alt={subscriber.email} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {subscriber.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <Badge 
                      variant={
                        new Date(subscriber.createdAt) >= thisMonth 
                          ? 'default' 
                          : 'secondary'
                      }
                      className="text-xs"
                    >
                      {new Date(subscriber.createdAt) >= thisMonth ? 'New' : 'Active'}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
