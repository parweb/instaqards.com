import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

import { AppSidebar } from 'components/app-sidebar';
import { MobileBottomNavColorful } from 'components/mobile-bottom-nav-colorful';
import { PriceTable } from 'components/price-table';
import Profile from 'components/profile';
// import { Separator } from 'components/ui/separator';
import UpgradeAccountModal from 'components/modal/upgrade-account';
import UpgradeAccountButton from 'components/upgrade-account-button';
import { db } from 'helpers/db';
import { getLang } from 'helpers/translate';
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

  const lang = await getLang();

  const prices = await db.price.findMany({
    where: {
      product: {
        active: true
      }
    }
  });

  return (
    <SidebarProvider>
      <AppSidebar sites={sites} role={session.user.role}>
        <Suspense fallback={null}>
          <Profile />
        </Suspense>
      </AppSidebar>

      <SidebarInset className="isolate overflow-hidden border-2 border-indigo-900/20">
        <header className="absolute top-4 left-1 z-20 flex shrink-0 items-center gap-2">
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

        <div className="isolate z-10 flex flex-1 flex-col overflow-y-auto pb-20 md:pb-0">
          {!subscription.valid() && (
            <div className="px-4 py-8">
              <Suspense fallback={null}>
                {/* @ts-ignore */}
                <PriceTable products={products} subscription={subscription} />
              </Suspense>
            </div>
          )}

          {subscription.hasTrial() && subscription.customerSinceDays() && (
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-lime-700 p-4 pl-9 text-white">
              <div>
                {31 - subscription.customerSinceDays()} days left in your trial
              </div>

              <div>
                <UpgradeAccountButton>
                  <UpgradeAccountModal lang={lang} prices={prices} />
                </UpgradeAccountButton>
              </div>
            </div>
          )}

          <div className="z-10 flex flex-1 flex-col self-stretch">
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </div>
      </SidebarInset>

      <MobileBottomNavColorful />
    </SidebarProvider>
  );
}
