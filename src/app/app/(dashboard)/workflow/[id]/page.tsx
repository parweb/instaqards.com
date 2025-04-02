import { db } from 'helpers/db';
import { notFound } from 'next/navigation';
import { WorkflowDiagram } from './WorkflowDiagram';

export default async function WorkflowPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const workflow = await db.workflow.findUnique({
    where: { id: params.id },
    include: {
      // states: { include: { user: true } },
      rules: {
        include: {
          action: true,
          trigger: true,
          executions: true,
          ruleConditions: {
            include: {
              condition: true,
              rule: true
            }
          }
        }
      }
    }
  });

  if (!workflow) {
    notFound();
  }

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {workflow.name}
          </h1>
          {workflow.description && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {workflow.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`rounded-full px-3 py-1 text-sm ${workflow.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}
          >
            {workflow.isActive ? 'Active' : 'Inactive'}
          </span>
          {workflow.isDefault && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Default
            </span>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <WorkflowDiagram workflow={workflow} />
      </div>
    </div>
  );
}
