import { db } from 'helpers/db';

export default async function WorkflowsTriggers() {
  const triggers = await db.trigger.findMany();

  return (
    <div className="flex flex-col space-y-6">
      {triggers.map(trigger => (
        <pre key={trigger.id}>{JSON.stringify(trigger, null, 2)}</pre>
      ))}
    </div>
  );
}
