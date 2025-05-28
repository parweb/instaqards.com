import { db } from 'helpers/db';

export default async function WorkflowsRules(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const rules = await db.rule.findMany({
    select: { id: true, trigger: true, action: true },
    where: {
      workflowId: params.id
    }
  });

  return (
    <div className="flex flex-col space-y-6">
      {rules.map(rule => (
        <pre key={rule.id}>{JSON.stringify(rule, null, 2)}</pre>
      ))}
    </div>
  );
}
