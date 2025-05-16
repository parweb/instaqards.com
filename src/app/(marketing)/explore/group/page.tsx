import { db } from 'helpers/db';
import Link from 'next/link';
import slugify from 'slugify';

export default async function ActivityPage() {
  const groups = await db.nafGroup.findMany({
    include: {
      division: {
        include: {
          section: true
        }
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{'Groupes'}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <div
            key={group.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {group.id}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              <Link href={`/explore/group/${group.id}-${slugify(group.title)}`}>
                {group.title}
              </Link>
            </h2>

            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex gap-1 items-center">
                <span className="font-medium">Section:</span>
                <Link
                  href={`/explore/section/${group.division.section.id}-${slugify(group.division.section.title)}`}
                >
                  {group.division.section.title}
                </Link>
              </p>

              <p className="flex gap-1 items-center">
                <span className="font-medium">Division:</span>
                <Link
                  href={`/explore/division/${group.division.id}-${slugify(group.division.title)}`}
                >
                  {group.division.title}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
