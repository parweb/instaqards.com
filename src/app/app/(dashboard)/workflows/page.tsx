import { db } from 'helpers/db';
import Link from 'next/link';
export default async function WorkflowsPage() {
  const workflows = await db.workflow.findMany();

  return (
    <div className="flex flex-col space-y-6">
      {workflows.map(workflow => (
        <div key={workflow.id}>
          <Link href={`/workflow/${workflow.id}`}>{workflow.name}</Link>
        </div>
      ))}
    </div>
  );
}
