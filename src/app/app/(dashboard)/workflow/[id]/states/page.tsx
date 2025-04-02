import { db } from 'helpers/db';

export default async function WorkflowStates(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const states = await db.workflowState.findMany({
    include: { user: true },
    where: { workflowId: params.id }
  });

  return (
    <div className="flex flex-col space-y-6">
      {states.map(state => (
        <pre key={state.id}>{JSON.stringify(state, null, 2)}</pre>
      ))}
    </div>
  );
}
