import Link from 'next/link';

import { db } from 'helpers/db';
import * as departement from 'data/departements-region';

export default async function ActivityPage() {
  const states = (
    await db.city.findMany({
      distinct: ['departement'],
      select: {
        departement: true
      }
    })
  ).map(state =>
    departement.get(state.departement as departement.Departement['id'])
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        {'Départements'}
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {states.map(state => (
          <div
            key={state.id}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600">
                {state.id}
              </span>
            </div>

            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              <Link
                href={`/explore/state/${state.id}-${state.departement}-${state.region}`}
              >
                {state.id} {state.departement}
              </Link>
            </h2>

            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              <Link href={`/explore/region/${state.region}`}>
                {state.region}
              </Link>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
