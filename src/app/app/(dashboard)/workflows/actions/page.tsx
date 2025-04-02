import { db } from 'helpers/db';

export default async function WorkflowsActions() {
  const actions = await db.action.findMany();

  return (
    <div className="flex flex-col space-y-6">
      {actions.map(action => (
        <pre key={action.id}>{JSON.stringify(action, null, 2)}</pre>
      ))}
    </div>
  );
}
