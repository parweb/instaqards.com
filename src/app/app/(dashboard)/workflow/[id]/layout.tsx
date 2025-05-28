import { Suspense, type ReactNode } from 'react';

import { translate } from 'helpers/translate';
import WorkflowNav from './nav';

export default async function WorkflowsLayout({
  children
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6 self-stretch p-8">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <h1 className="font-cal text-xl font-bold sm:text-3xl">
          {await translate('dashboard.workflows.title')}
        </h1>
      </div>

      <Suspense fallback={null}>
        <WorkflowNav />
      </Suspense>

      {children}
    </div>
  );
}
