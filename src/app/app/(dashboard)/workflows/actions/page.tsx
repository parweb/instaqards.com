import { db } from 'helpers/db';

export default async function WorkflowsActions() {
  const actions = await db.action.findMany();

  // // Récupérer toutes les actions et les grouper par type
  // const actions = await db.action.findMany({
  //   orderBy: {
  //     internalName: 'asc'
  //   }
  // });

  // const actionsByType = actionTypes.reduce<Record<ActionType, Action[]>>(
  //   (acc, { actionType }) => {
  //     acc[actionType] = actions.filter(
  //       action => action.actionType === actionType
  //     );
  //     return acc;
  //   },
  //   {} as Record<ActionType, Action[]>
  // );

  return actions.map(action => (
    <pre key={action.id}>{JSON.stringify(action, null, 2)}</pre>
  ));
}
