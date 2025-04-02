import { db } from 'helpers/db';
import { notFound } from 'next/navigation';

export default async function WorkflowPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const workflow = await db.workflow.findUnique({
    where: { id: params.id }
  });

  if (!workflow) {
    notFound();
  }

  return <div>{workflow.name}</div>;
}
