import { db } from 'helpers/db';
import { UserCard } from 'components/UserCard';
import { FiltersBar } from 'components/FiltersBar';

export default async function DivisionPage({
  params
}: {
  params: Promise<{ division: string }>;
}) {
  const [division] = (await params).division.split('-');
  const users = await db.user.findMany({
    where: {
      codeNaf: {
        startsWith: division
      }
    }
  });

  return (
    <section className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">
        Annuaire des entreprises pour la division {division}
      </h1>
      <FiltersBar name="division" value={division} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user: any) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      {users.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Aucun commerce trouvé pour cette division.
        </div>
      )}
    </section>
  );
}
