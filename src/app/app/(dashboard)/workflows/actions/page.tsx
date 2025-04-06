import { db } from 'helpers/db';

export default async function WorkflowsActions() {
  const actions = await db.action.findMany();

  // // Récupérer toutes les actions et les grouper par type
  // const actions = await db.action.findMany({
  //   orderBy: {
  //     code: 'asc'
  //   }
  // });

  // const actionsByType = types.reduce<Record<Action['type'], Action[]>>(
  //   (acc, { type }) => {
  //     acc[type] = actions.filter(
  //       action => action.type === type
  //     );
  //     return acc;
  //   },
  //   {} as Record<Action['type'], Action[]>
  // );

  return actions.map(action => (
    <pre key={action.id}>{JSON.stringify(action, null, 2)}</pre>
  ));
}
