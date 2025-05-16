import { db } from 'helpers/db';
import { UserCard } from 'components/UserCard';
import { FiltersBar } from 'components/FiltersBar';

export default async function GroupPage({
  params
}: {
  params: Promise<{ group: string }>;
}) {
  const [group] = (await params).group.split('-');
  const users = await db.user.findMany({
    where: {
      codeNaf: {
        startsWith: group
      }
    }
  });

  return (
    <section className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">
        Annuaire des entreprises pour le groupe {group}
      </h1>
      <FiltersBar name="group" value={group} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user: any) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      {users.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Aucun commerce trouvé pour ce groupe.
        </div>
      )}
    </section>
  );
}
