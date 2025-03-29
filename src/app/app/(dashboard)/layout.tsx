import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

import { AppSidebar } from 'components/app-sidebar';
import { PriceTable } from 'components/price-table';
import Profile from 'components/profile';
// import { Separator } from 'components/ui/separator';
import { db } from 'helpers/db';
import { getSession, getSubscription } from 'lib/auth';

// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator
// } from 'components/ui/breadcrumb';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from 'components/ui/sidebar';

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const subscription = await getSubscription();

  const products = await db.product.findMany({
    where: { active: { equals: true } },
    include: {
      prices: {
        where: {
          active: { equals: true },
          interval_count: { equals: 1 }
        }
      }
    }
  });

  const sites = await db.site.findMany({
    include: {
      clicks: true,
      subscribers: true,
      blocks: { include: { reservations: true } }
    },
    orderBy: { updatedAt: 'desc' },
    where: {
      userId: session.user.id
    }
  });

  return (
    <SidebarProvider>
      <AppSidebar sites={sites} role={session.user.role}>
        <Suspense fallback={null}>
          <Profile />
        </Suspense>
      </AppSidebar>

      <SidebarInset className="overflow-hidden border-2 border-indigo-900/20 ">
        <header className="absolute top-1 left-1 flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 p-1">
            <SidebarTrigger className="-ml-1 md:hidden" />

            {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}

            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  <BreadcrumbPage>Data yo</BreadcrumbPage>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  <BreadcrumbPage>Data hey</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-y-auto">
          {!subscription.valid() && (
            <div className="px-4 py-8">
              <Suspense fallback={null}>
                {/* @ts-ignore */}
                <PriceTable products={products} subscription={subscription} />
              </Suspense>
            </div>
          )}

          {subscription.hasTrial() && subscription.customerSinceDays() && (
            <div className="p-6 bg-lime-700 text-white sticky top-0">
              {30 - subscription.customerSinceDays()} days left in your trial
            </div>
          )}

          <div className="flex flex-col flex-1 self-stretch">
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
