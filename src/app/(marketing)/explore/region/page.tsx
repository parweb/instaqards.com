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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        {'Départements'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {states.map(state => (
          <div
            key={state.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {state.id}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              <Link
                href={`/explore/state/${state.id}-${state.departement}-${state.region}`}
              >
                {state.id} {state.departement}
              </Link>
            </h2>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
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
