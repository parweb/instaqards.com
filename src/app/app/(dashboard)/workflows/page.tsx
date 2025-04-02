import { db } from 'helpers/db';
import Link from 'next/link';
export default async function WorkflowsPage() {
  const workflows = await db.workflow.findMany({
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

  return (
    <div className="flex flex-col space-y-6">
      {workflows.map(workflow => (
        <div key={workflow.id}>
          <Link href={`/workflow/${workflow.id}`}>{workflow.name}</Link>
          <pre>{JSON.stringify(workflow, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
