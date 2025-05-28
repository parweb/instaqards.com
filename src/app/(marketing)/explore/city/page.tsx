import { db } from 'helpers/db';
import Link from 'next/link';
import slugify from 'slugify';

export default async function ActivityPage() {
  const cities = await db.city.findMany();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        {"Codes d'Activités"}
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cities.map(city => (
          <div
            key={city.id}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600">
                {city.id}
              </span>
            </div>

            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              <Link
                href={`/explore/city/${city.id}-${slugify(city?.nomReel ?? '')}`}
              >
                {city.nomReel}
              </Link>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
