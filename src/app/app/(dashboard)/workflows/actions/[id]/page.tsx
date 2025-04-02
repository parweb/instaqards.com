import { ActionType } from '@prisma/client';

import { db } from 'helpers/db';

export default async function WorkflowActionPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const query = await params;

  const actions = await db.action.findMany({
    where: {
      actionType: query.id as ActionType
    }
  });

  return <pre>{JSON.stringify(actions, null, 2)}</pre>;
}
