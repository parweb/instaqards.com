import { Suspense, type ReactNode } from 'react';

import { translate } from 'helpers/translate';
import WorkflowsNav from './nav';

export default async function WorkflowsLayout({
  children
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  return (
    <div className="p-8 flex flex-col gap-6 flex-1 self-stretch">
      <div className="flex flex-col items-center sm:flex-row justify-between">
        <h1 className="font-cal text-xl font-bold sm:text-3xl">
          {await translate('dashboard.workflows.title')}
        </h1>
      </div>

      <Suspense fallback={null}>
        <WorkflowsNav />
      </Suspense>

      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
