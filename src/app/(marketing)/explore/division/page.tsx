import { db } from 'helpers/db';
import Link from 'next/link';
import slugify from 'slugify';

export default async function ActivityPage() {
  const divisions = await db.nafDivision.findMany({
    select: {
      id: true,
      title: true,
      section: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">{'Divisions'}</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {divisions.map(division => (
          <div
            key={division.id}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600">
                {division.id}
              </span>
            </div>

            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              <Link
                href={`/explore/division/${division.id}-${slugify(division.title)}`}
              >
                {division.title}
              </Link>
            </h2>

            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <span className="font-medium">Section:</span>
                <Link
                  href={`/explore/section/${division.section.id}-${slugify(division.section.title)}`}
                >
                  {division.section.title}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
