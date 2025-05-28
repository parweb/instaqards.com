import { Action } from '@prisma/client';

import { db } from 'helpers/db';

export default async function WorkflowActionPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const query = await params;
  const actions = await db.action.findMany({
    select: { id: true, type: true },
    where: {
      type: query.id as Action['type']
    }
  });

  return <pre>{JSON.stringify(actions, null, 2)}</pre>;
}
