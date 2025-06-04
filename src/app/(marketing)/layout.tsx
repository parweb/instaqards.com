import { Suspense } from 'react';

import { Header } from './home/section/header';

export default function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="layout" className="flex flex-col">
      <Header />

      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
