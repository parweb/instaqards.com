import { db } from 'helpers/db';
import { UserCard } from 'components/UserCard';
import { FiltersBar } from 'components/FiltersBar';

export default async function SectionPage({
  params
}: {
  params: Promise<{ section: string }>;
}) {
  const [section] = (await params).section.split('-');
  const users = await db.user.findMany({
    where: {
      codeNaf: {
        startsWith: section
      }
    }
  });

  return (
    <section className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">
        Annuaire des entreprises pour la section {section}
      </h1>
      <FiltersBar name="section" value={section} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user: any) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      {users.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Aucun commerce trouvé pour cette section.
        </div>
      )}
    </section>
  );
}
