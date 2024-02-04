import { ReactNode, Suspense } from 'react';

import Nav from 'components/nav';
import Profile from 'components/profile';

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <Nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Nav>
      <div className="min-h-screen dark:bg-black sm:pl-60">{children}</div>
    </div>
  );
}
