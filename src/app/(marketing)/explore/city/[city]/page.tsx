import { db } from 'helpers/db';
import { UserCard } from 'components/UserCard';
import { FiltersBar } from 'components/FiltersBar';

export default async function CityPage({
  params
}: {
  params: { city: string };
}) {
  const [postcode] = params.city.split('-');
  const users = await db.user.findMany({ where: { postcode } });

  // On suppose que le département = les 2 premiers chiffres du code postal
  const state = postcode.slice(0, 2);

  return (
    <section className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">
        Annuaire des entreprises à {postcode}
      </h1>
      <FiltersBar city={postcode} state={state} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user: any) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      {users.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Aucun commerce trouvé pour cette ville.
        </div>
      )}
    </section>
  );
}
